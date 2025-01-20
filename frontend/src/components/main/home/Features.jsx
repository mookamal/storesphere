"use client";
import { 
  ShoppingCart, 
  BarChart, 
  Settings, 
  Globe, 
  CreditCard, 
  Zap 
} from "lucide-react";

const features = [
  {
    icon: ShoppingCart,
    title: "Easy Store Setup",
    description: "Create and customize your online store in minutes with our intuitive interface."
  },
  {
    icon: BarChart,
    title: "Advanced Analytics",
    description: "Get real-time insights and performance metrics for your multiple stores."
  },
  {
    icon: Globe,
    title: "Multi-Channel Selling",
    description: "Seamlessly sell across different platforms and marketplaces."
  },
  {
    icon: CreditCard,
    title: "Flexible Payments",
    description: "Support multiple payment gateways and currencies worldwide."
  },
  {
    icon: Settings,
    title: "Customization",
    description: "Fully customizable themes and layouts to match your brand."
  },
  {
    icon: Zap,
    title: "High Performance",
    description: "Lightning-fast stores optimized for speed and user experience."
  }
];

export default function FeaturesSection() {
  return (
    <section className="bg-white dark:bg-gray-900 py-16 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Powerful Features for Your Business
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Everything you need to create, manage, and grow multiple online stores efficiently.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 group"
            >
              <div className="flex items-center mb-4">
                <feature.icon 
                  className="w-10 h-10 text-purple-600 mr-4 group-hover:scale-110 transition-transform" 
                />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
