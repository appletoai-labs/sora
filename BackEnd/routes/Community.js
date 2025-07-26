const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const auth = require("../middleware/auth");

// Get all posts
router.get("/posts", auth, async (req, res) => {
    try {
        const { category, limit = 20, page = 1 } = req.query;

        const query = { isActive: true };
        if (category) {
            query.category = category;
        }

        const posts = await Post.find(query)
            .sort({ createdAt: -1 })
            .limit(Number.parseInt(limit))
            .skip((Number.parseInt(page) - 1) * Number.parseInt(limit))
            .populate("userId", "username")
            .lean();

        // Add user reaction status for each post
        const postsWithUserReactions = posts.map((post) => {
            const userReactions = {
                heart: false,
                helpful: false,
                solidarity: false,
            };

            post.userReactions.forEach((reaction) => {
                if (reaction.userId && reaction.userId.toString() === req.user._id.toString()) {
                    userReactions[reaction.reactionType] = true;
                }
            });

            return {
                ...post,
                userReactions,
            };
        });

        res.json({
            success: true,
            posts: postsWithUserReactions,
            pagination: {
                page: Number.parseInt(page),
                limit: Number.parseInt(limit),
                hasMore: posts.length === Number.parseInt(limit),
            },
        });
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch posts",
            error: error.message,
        });
    }
});

// Get single post by ID
router.get("/posts/:postId", auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId).populate("userId", "username").lean();

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found",
            });
        }

        // Add user reaction status
        const userReactions = {
            heart: false,
            helpful: false,
            solidarity: false,
        };

        post.userReactions.forEach((reaction) => {
            if (reaction.userId && reaction.userId.toString() === req.user._id.toString()) {
                userReactions[reaction.reactionType] = true;
            }
        });

        res.json({
            success: true,
            post: {
                ...post,
                userReactions,
            },
        });
    } catch (error) {
        console.error("Error fetching post:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch post",
            error: error.message,
        });
    }
});

// Create new post
router.post("/createpost", auth, async (req, res) => {
    try {
        const { title, content, category, isAnonymous = false, safeSpace = null } = req.body;

        // Validation
        if (!title || !content || !category) {
            return res.status(400).json({
                success: false,
                message: "Title, content, and category are required",
            });
        }

        if (!["support", "celebrations", "advice", "resources"].includes(category)) {
            return res.status(400).json({
                success: false,
                message: "Invalid category",
            });
        }

        // Validate safeSpace if provided
        if (
            safeSpace &&
            ![
                "adhd-support",
                "autistic-community",
                "sensory-support",
                "anxiety-overwhelm",
                "executive-function",
                "social-connection",
            ].includes(safeSpace)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid safe space",
            });
        }

        if (title.length > 200) {
            return res.status(400).json({
                success: false,
                message: "Title must be 200 characters or less",
            });
        }

        if (content.length > 5000) {
            return res.status(400).json({
                success: false,
                message: "Content must be 5000 characters or less",
            });
        }

        const newPost = new Post({
            userId: req.user._id,
            username: `${req.user.firstName} ${req.user.lastName}`,
            title: title.trim(),
            content: content.trim(),
            category,
            isAnonymous,
            safeSpace,
        });

        await newPost.save();

        res.status(201).json({
            success: true,
            message: "Post created successfully",
            post: {
                ...newPost.toObject(),
                userReactions: {
                    heart: false,
                    helpful: false,
                    solidarity: false,
                },
            },
        });
    } catch (error) {
        console.error("Error creating post:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create post",
            error: error.message,
        });
    }
});

// Add reaction to post
router.post("/posts/:postId/reactions", auth, async (req, res) => {
    try {
        const { reactionType } = req.body;
        const postId = req.params.postId;

        if (!["heart", "helpful", "solidarity"].includes(reactionType)) {
            return res.status(400).json({
                success: false,
                message: "Invalid reaction type",
            });
        }

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found",
            });
        }

        // Check if user already reacted with this type
        const existingReactionIndex = post.userReactions.findIndex(
            (reaction) => reaction.userId && reaction.userId.toString() === req.user._id.toString() && reaction.reactionType === reactionType
        );

        if (existingReactionIndex > -1) {
            // Remove reaction (toggle off)
            post.userReactions.splice(existingReactionIndex, 1);
            post.reactions[reactionType] = Math.max(0, post.reactions[reactionType] - 1);
        } else {
            // Add reaction
            post.userReactions.push({
                userId: req.user._id,
                reactionType,
            });
            post.reactions[reactionType] += 1;
        }

        await post.save();

        // Return user reaction status
        const userReactions = {
            heart: false,
            helpful: false,
            solidarity: false,
        };

        post.userReactions.forEach((reaction) => {
            if (reaction.userId && reaction.userId.toString() === req.user._id.toString()) {
                userReactions[reaction.reactionType] = true;
            }
        });

        res.json({
            success: true,
            message: "Reaction updated successfully",
            reactions: post.reactions,
            userReactions,
        });
    } catch (error) {
        console.error("Error updating reaction for post:", postId, error);
        res.status(500).json({
            success: false,
            message: "Failed to update reaction",
            error: error.message,
        });
    }
});

// Add response to post
router.post("/posts/:postId/responses", auth, async (req, res) => {
    try {
        const { content, isAnonymous = false } = req.body;
        const postId = req.params.postId;

        if (!content || content.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: "Response content is required",
            });
        }

        if (content.length > 2000) {
            return res.status(400).json({
                success: false,
                message: "Response must be 2000 characters or less",
            });
        }

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found",
            });
        }

        const newResponse = {
            userId: req.user._id,
            username: `${req.user.firstName} ${req.user.lastName}`,
            content: content.trim(),
            isAnonymous,
            createdAt: new Date(),
        };

        post.responses.push(newResponse);
        await post.save();

        res.status(201).json({
            success: true,
            message: "Response added successfully",
            response: newResponse,
        });
    } catch (error) {
        console.error("Error adding response to post:", postId, error);
        res.status(500).json({
            success: false,
            message: "Failed to add response",
            error: error.message,
        });
    }
});

// Get posts by category
router.get("/posts/category/:category", auth, async (req, res) => {
    try {
        const { category } = req.params;
        const { limit = 20, page = 1 } = req.query;

        if (!["support", "celebrations", "advice", "resources"].includes(category)) {
            return res.status(400).json({
                success: false,
                message: "Invalid category",
            });
        }

        const posts = await Post.find({ category, isActive: true })
            .sort({ createdAt: -1 })
            .limit(Number.parseInt(limit))
            .skip((Number.parseInt(page) - 1) * Number.parseInt(limit))
            .populate("userId", "username")
            .lean();

        // Add user reaction status for each post
        const postsWithUserReactions = posts.map((post) => {
            const userReactions = {
                heart: false,
                helpful: false,
                solidarity: false,
            };

            post.userReactions.forEach((reaction) => {
                if (reaction.userId && reaction.userId.toString() === req.user._id.toString()) {
                    userReactions[reaction.reactionType] = true;
                }
            });

            return {
                ...post,
                userReactions,
            };
        });

        res.json({
            success: true,
            posts: postsWithUserReactions,
            category,
            pagination: {
                page: Number.parseInt(page),
                limit: Number.parseInt(limit),
                hasMore: posts.length === Number.parseInt(limit),
            },
        });
    } catch (error) {
        console.error("Error fetching posts by category:", category, error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch posts",
            error: error.message,
        });
    }
});

// Get user's posts
router.get("/my-posts", auth, async (req, res) => {
    try {
        const { limit = 20, page = 1 } = req.query;

        const posts = await Post.find({ userId: req.user._id, isActive: true })
            .sort({ createdAt: -1 })
            .limit(Number.parseInt(limit))
            .skip((Number.parseInt(page) - 1) * Number.parseInt(limit))
            .lean();

        res.json({
            success: true,
            posts,
            pagination: {
                page: Number.parseInt(page),
                limit: Number.parseInt(limit),
                hasMore: posts.length === Number.parseInt(limit),
            },
        });
    } catch (error) {
        console.error("Error fetching user posts:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch your posts",
            error: error.message,
        });
    }
});

// Delete post (soft delete)
router.delete("/posts/:postId", auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found",
            });
        }

        // Check if user owns the post
        if (post.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You can only delete your own posts",
            });
        }

        post.isActive = false;
        await post.save();

        res.json({
            success: true,
            message: "Post deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting post:", req.params.postId, error);
        res.status(500).json({
            success: false,
            message: "Failed to delete post",
            error: error.message,
        });
    }
});

// Get posts by safe space
router.get("/posts/space/:spaceId", auth, async (req, res) => {
    try {
        const { spaceId } = req.params;
        const { limit = 20, page = 1 } = req.query;

        if (
            ![
                "adhd-support",
                "autistic-community",
                "sensory-support",
                "anxiety-overwhelm",
                "executive-function",
                "social-connection",
            ].includes(spaceId)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid safe space",
            });
        }

        const posts = await Post.find({ safeSpace: spaceId, isActive: true })
            .sort({ createdAt: -1 })
            .limit(Number.parseInt(limit))
            .skip((Number.parseInt(page) - 1) * Number.parseInt(limit))
            .populate("userId", "username")
            .lean();

        // Add user reaction status for each post
        const postsWithUserReactions = posts.map((post) => {
            const userReactions = {
                heart: false,
                helpful: false,
                solidarity: false,
            };

            post.userReactions.forEach((reaction) => {
                if (reaction.userId && reaction.userId.toString() === req.user._id.toString()) {
                    userReactions[reaction.reactionType] = true;
                }
            });

            return {
                ...post,
                userReactions,
            };
        });

        res.json({
            success: true,
            posts: postsWithUserReactions,
            safeSpace: spaceId,
            pagination: {
                page: Number.parseInt(page),
                limit: Number.parseInt(limit),
                hasMore: posts.length === Number.parseInt(limit),
            },
        });
    } catch (error) {
        console.error("Error fetching posts by safe space:", spaceId, error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch posts",
            error: error.message,
        });
    }
});

// Get safe spaces list
router.get("/safe-spaces", auth, async (req, res) => {
    try {
        const safeSpaces = [
            {
                id: "adhd-support",
                name: "ADHD Support Circle",
                tag: "ADHD Support",
                description:
                    "A supportive community for those with ADHD to share experiences, strategies, and celebrate unique ways of thinking and being.",
                icon: "🧠",
                borderColor: "border-red-500/30",
                focusAreas: [
                    "Executive function strategies",
                    "Hyperfocus and attention challenges",
                    "Emotional regulation",
                    "Celebrating neurodivergent strengths",
                ],
            },
            {
                id: "autistic-community",
                name: "Autistic Community",
                tag: "Autism Support",
                description:
                    "A space for autistic individuals to connect, share experiences, and support each other in navigating a neurotypical world.",
                icon: "🧩",
                borderColor: "border-blue-500/30",
                focusAreas: [
                    "Sensory processing experiences",
                    "Social communication",
                    "Stimming and self-regulation",
                    "Identity and self-advocacy",
                ],
            },
            {
                id: "sensory-support",
                name: "Sensory Support Hub",
                tag: "Sensory Support",
                description:
                    "Share strategies, tools, and support for managing sensory processing challenges and sensory overload.",
                icon: "👁️",
                borderColor: "border-green-500/30",
                focusAreas: [
                    "Sensory overload management",
                    "Environmental modifications",
                    "Sensory tools and aids",
                    "Calming techniques",
                ],
            },
            {
                id: "anxiety-overwhelm",
                name: "Anxiety & Overwhelm Support",
                tag: "Mental Health Support",
                description:
                    "A gentle space for sharing experiences with anxiety, overwhelm, and mental health challenges common in neurodivergent individuals.",
                icon: "☁️",
                borderColor: "border-teal-500/30",
                focusAreas: [
                    "Anxiety management strategies",
                    "Overwhelm prevention",
                    "Emotional regulation",
                    "Self-care practices",
                ],
            },
            {
                id: "executive-function",
                name: "Executive Function Support",
                tag: "Executive Function",
                description:
                    "Share strategies, tools, and encouragement for managing executive function challenges like planning, organization, and task management.",
                icon: "📋",
                borderColor: "border-yellow-500/30",
                focusAreas: [
                    "Planning and organization",
                    "Task initiation and completion",
                    "Time management",
                    "Working memory strategies",
                ],
            },
            {
                id: "social-connection",
                name: "Social Connection Circle",
                tag: "Social Support",
                description:
                    "A welcoming space for building friendships, sharing social experiences, and navigating relationships as a neurodivergent person.",
                icon: "👥",
                borderColor: "border-purple-500/30",
                focusAreas: [
                    "Building friendships",
                    "Social communication",
                    "Relationship challenges",
                    "Social skills and confidence",
                ],
            },
        ];

        // Get post counts for each safe space
        const spacesWithCounts = await Promise.all(
            safeSpaces.map(async (space) => {
                const postCount = await Post.countDocuments({ safeSpace: space.id, isActive: true });
                return {
                    ...space,
                    postCount,
                };
            })
        );

        res.json({
            success: true,
            safeSpaces: spacesWithCounts,
        });
    } catch (error) {
        console.error("Error fetching safe spaces:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch safe spaces",
            error: error.message,
        });
    }
});

// Get safe space statistics
router.get("/safe-spaces/:spaceId/stats", auth, async (req, res) => {
    try {
        const { spaceId } = req.params;

        if (
            ![
                "adhd-support",
                "autistic-community",
                "sensory-support",
                "anxiety-overwhelm",
                "executive-function",
                "social-connection",
            ].includes(spaceId)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid safe space",
            });
        }

        const postCount = await Post.countDocuments({ safeSpace: spaceId, isActive: true });
        const responseCount = await Post.aggregate([
            { $match: { safeSpace: spaceId, isActive: true } },
            { $project: { responseCount: { $size: "$responses" } } },
            { $group: { _id: null, totalResponses: { $sum: "$responseCount" } } },
        ]);

        const reactionCount = await Post.aggregate([
            { $match: { safeSpace: spaceId, isActive: true } },
            {
                $project: {
                    totalReactions: {
                        $add: ["$reactions.heart", "$reactions.helpful", "$reactions.solidarity"],
                    },
                },
            },
            { $group: { _id: null, totalReactions: { $sum: "$totalReactions" } } },
        ]);

        res.json({
            success: true,
            stats: {
                postCount,
                responseCount: responseCount[0]?.totalResponses || 0,
                reactionCount: reactionCount[0]?.totalReactions || 0,
            },
        });
    } catch (error) {
        console.error("Error fetching safe space stats:", spaceId, error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch safe space statistics",
            error: error.message,
        });
    }
});

module.exports = router;