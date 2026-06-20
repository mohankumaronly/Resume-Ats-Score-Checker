import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Sparkles,
  LayoutTemplate,
  FileText,
  Smartphone,
  ArrowRight,
  CheckCircle,
  Star,
  Users,
} from "lucide-react";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import Badge from "../../components/common/Badge";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Sparkles className="h-6 w-6 text-primary-600" />,
      title: "AI-Powered Improvement",
      description: "Get intelligent suggestions to optimize your resume for ATS and recruiters.",
    },
    {
      icon: <LayoutTemplate className="h-6 w-6 text-primary-600" />,
      title: "Professional Templates",
      description: "Choose from multiple ATS-friendly templates designed by professionals.",
    },
    {
      icon: <FileText className="h-6 w-6 text-primary-600" />,
      title: "Easy Resume Builder",
      description: "Build your resume in minutes with our intuitive drag-and-drop editor.",
    },
    {
      icon: <Smartphone className="h-6 w-6 text-primary-600" />,
      title: "Mobile Friendly",
      description: "Create and edit your resume on the go with fully responsive design.",
    },
  ];

  const templates = [
    {
      name: "Modern Clean",
      description: "Minimalist design with a contemporary feel",
      badge: "Popular",
      image: "https://placehold.co/600x400/3b82f6/ffffff?text=Modern+Template",
    },
    {
      name: "Classic Professional",
      description: "Traditional layout perfect for corporate roles",
      badge: "Classic",
      image: "https://placehold.co/600x400/1e293b/ffffff?text=Classic+Template",
    },
    {
      name: "Minimal Elegant",
      description: "Clean design with sophisticated typography",
      badge: "Premium",
      image: "https://placehold.co/600x400/7c3aed/ffffff?text=Minimal+Template",
    },
  ];

  const steps = [
    { number: "01", title: "Sign Up", description: "Create your account with email" },
    { number: "02", title: "Choose Template", description: "Pick from our professional templates" },
    { number: "03", title: "Add Your Details", description: "Fill in your experience and skills" },
    { number: "04", title: "AI Improve", description: "Get AI suggestions to perfect your resume" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary-50 to-white dark:from-primary-950/30 dark:to-gray-950 py-20 md:py-32">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <Badge variant="premium" className="mb-6">
              🚀 AI-Powered Resume Builder
            </Badge>
            <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
              Build ATS-Friendly Resumes
              <br />
              <span className="gradient-text">with AI Assistance</span>
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
              Create professional resumes that stand out to recruiters and pass ATS screening.
              Get AI-powered suggestions to improve your content.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button
                size="lg"
                onClick={() => navigate("/login")}
                icon={<Sparkles className="h-5 w-5" />}
              >
                Get Started Free
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => document.getElementById("templates")?.scrollIntoView({ behavior: "smooth" })}
                icon={<ArrowRight className="h-5 w-5" />}
                iconPosition="right"
              >
                View Templates
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-green-500" />
                No credit card required
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Free to build
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Pay only to download
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
              Everything You Need to Build a Great Resume
            </h2>
            <p className="mx-auto max-w-2xl text-gray-600 dark:text-gray-400">
              Our platform combines powerful tools with AI intelligence to help you create
              the perfect resume.
            </p>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card hover className="h-full text-center">
                  <div className="mb-4 inline-flex rounded-xl bg-primary-50 p-3 dark:bg-primary-950/30">
                    {feature.icon}
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Templates Showcase */}
      <section id="templates" className="bg-gray-50 py-20 dark:bg-gray-900/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
              Professional Templates
            </h2>
            <p className="mx-auto max-w-2xl text-gray-600 dark:text-gray-400">
              Choose from our collection of ATS-friendly templates designed by experts.
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-3">
            {templates.map((template, index) => (
              <motion.div
                key={template.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card hover className="overflow-hidden p-0">
                  <img
                    src={template.image}
                    alt={template.name}
                    className="h-48 w-full object-cover"
                  />
                  <div className="p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {template.name}
                      </h3>
                      <Badge variant={template.badge === "Premium" ? "premium" : "default"}>
                        {template.badge}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {template.description}
                    </p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Button variant="outline" onClick={() => navigate("/templates")}>
              View All Templates
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
              How It Works
            </h2>
            <p className="mx-auto max-w-2xl text-gray-600 dark:text-gray-400">
              Get started in minutes with our simple 4-step process.
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-4">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 text-2xl font-bold text-primary-600 dark:bg-primary-950/30 dark:text-primary-400">
                    {step.number}
                  </div>
                  <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {step.description}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className="absolute left-[60%] top-8 hidden h-0.5 w-[60%] bg-primary-200 md:block dark:bg-primary-800" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 py-16 dark:from-primary-700 dark:to-primary-800">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-4 text-3xl font-bold text-white">
              Ready to Build Your Resume?
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-primary-100">
              Join thousands of professionals who have built their resumes with us.
              Start for free today.
            </p>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => navigate("/login")}
              icon={<Sparkles className="h-5 w-5" />}
              className="bg-white text-primary-600 hover:bg-primary-50"
            >
              Start Building Now
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;