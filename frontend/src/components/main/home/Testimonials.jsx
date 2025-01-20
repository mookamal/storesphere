"use client";
import Image from "next/image";
import { Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "E-commerce Entrepreneur",
    quote: "This platform transformed my business. Managing multiple stores has never been easier!",
    avatar: "/assets/images/avatars/female-avatar.svg",
    company: "Fashion Boutique"
  },
  {
    name: "Michael Chen",
    role: "Tech Startup Founder",
    quote: "The analytics and multi-channel selling features are game-changers for our growth strategy.",
    avatar: "/assets/images/avatars/male-avatar.svg", 
    company: "Tech Innovations Inc."
  },
  {
    name: "Emma Rodriguez",
    role: "Small Business Owner",
    quote: "Incredibly user-friendly. I've scaled my business across multiple platforms without stress.",
    avatar: "/assets/images/avatars/female-avatar.svg",
    company: "Artisan Crafts"
  }
];

export default function TestimonialsSection() {
  return (
    <section className="bg-gray-50 dark:bg-gray-900 py-16 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            What Our Customers Say
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Real stories from entrepreneurs who've transformed their businesses with our platform.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <Quote className="text-purple-600 mb-4 w-12 h-12 opacity-20" />
              <p className="text-gray-700 dark:text-gray-300 mb-6 italic">
                "{testimonial.quote}"
              </p>
              
              <div className="flex items-center">
                <div className="relative w-12 h-12 mr-4">
                  <Image 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {testimonial.role} @ {testimonial.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
