import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const SupportCards = () => {
  const items = [
    {
      title: "Understand Your Strengths",
      description: "Discover what makes your brain unique. Embrace neurodiversity and build strategies around your strengths."
    },
    {
      title: "Daily Life Guidance",
      description: "Get support for routines, planning, and communication in school, work, or home environments."
    },
    {
      title: "Personalized Coping Tools",
      description: "Receive tools and strategies to manage sensory overload, executive functioning challenges, and more."
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-4 pb-6">
      {items.map((item, idx) => (
        <Card key={idx} className="bg-white shadow-sm border border-gray-200 rounded-xl">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-gray-800">
              {item.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-sm text-gray-600">
              {item.description}
            </CardDescription>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SupportCards;
