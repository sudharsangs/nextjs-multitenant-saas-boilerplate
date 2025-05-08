"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Box, Globe, BarChart, Settings, ShoppingCart, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  color: string;
}

const FeatureCard = ({ icon, title, description, href, color }: FeatureCardProps) => {
  return (
    <Card className="flex flex-col h-full border border-border bg-card hover:shadow-md transition-shadow p-6">
      <div className={`p-3 rounded-full w-fit ${color} mb-4`}>
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-4 flex-grow">{description}</p>
      <Link href={href}>
        <Button variant="ghost" className="p-0 h-auto text-primary hover:text-primary/90">
          Explore <ArrowRight size={16} className="ml-1" />
        </Button>
      </Link>
    </Card>
  );
};

export default function DemoHome() {
  const features = [
    {
      icon: <Box size={24} className="text-blue-500" />,
      title: "Inventory Management",
      description: "Track stock levels, manage products and categories, handle batches, and more.",
      href: "/demo/inventory/stock",
      color: "bg-blue-100",
    },
    {
      icon: <Globe size={24} className="text-indigo-500" />,
      title: "Location Management",
      description: "Organize warehouses, facilities and storage locations across multiple sites.",
      href: "/demo/locations",
      color: "bg-indigo-100",
    },
    {
      icon: <Truck size={24} className="text-amber-500" />,
      title: "Purchasing",
      description: "Create purchase orders, manage vendors, and track incoming inventory.",
      href: "/demo/purchases/orders",
      color: "bg-amber-100",
    },
    {
      icon: <ShoppingCart size={24} className="text-green-500" />,
      title: "Sales Management",
      description: "Process orders, manage customers, and generate invoices with ease.",
      href: "/demo/sales/orders",
      color: "bg-green-100",
    },
    {
      icon: <Settings size={24} className="text-purple-500" />,
      title: "Manufacturing",
      description: "Create bills of materials, production orders, and quality control checks.",
      href: "/demo/manufacturing/production-orders",
      color: "bg-purple-100",
    },
    {
      icon: <BarChart size={24} className="text-rose-500" />,
      title: "Reports & Analytics",
      description: "Generate inventory reports, sales analysis, and tax summaries.",
      href: "/demo/reports/inventory",
      color: "bg-rose-100",
    },
  ];

  return (
    <div className="space-y-8">
      <section className="bg-muted/30 rounded-lg p-8 border border-border">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Welcome to FactoStack Demo
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Experience the full power of our comprehensive inventory management system.
            No sign-up required. Explore all premium features in this interactive demo.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link href="/demo/dashboard">
              <Button size="lg">
                Go to Dashboard
                <ArrowRight size={16} />
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button variant="outline" size="lg">
                Create Free Account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Explore Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </section>

      <section className="bg-card rounded-lg p-8 border border-border">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="md:w-1/2">
            <h2 className="text-2xl font-bold mb-4">Premium Enterprise Features</h2>
            <p className="text-muted-foreground mb-4">
              This demo showcases our enterprise-level capabilities with full access to all features.
              In the real application, features are available based on your subscription tier.
            </p>
            <div className="space-y-3">
              {[
                "Multi-location inventory tracking",
                "Advanced manufacturing workflow",
                "Customizable reporting",
                "Batch and lot tracking",
                "Quality control management",
                "User role permissions"
              ].map((feature, index) => (
                <div key={index} className="flex items-center">
                  <div className="mr-2 h-4 w-4 rounded-full bg-green-500 flex items-center justify-center">
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 4L3 6L7 2" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <Link href="/auth/register">
                <Button>Get Started With Your Own Account</Button>
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 bg-muted/30 p-6 rounded-lg border border-border flex justify-center">
            <Image
              src="/logo.svg"
              alt="FactoStack Enterprise"
              width={300}
              height={200}
              priority
              className="object-contain"
            />
          </div>
        </div>
      </section>
    </div>
  );
}