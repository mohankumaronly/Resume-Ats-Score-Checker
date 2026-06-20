import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Search, Sparkles, Check, LayoutTemplate, Star } from "lucide-react";
import { templateService } from "../../services/template.service";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Badge from "../../components/common/Badge";
import Loader from "../../components/common/Loader";
import type { Template } from "../../types/template";

const TemplatesPage: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const navigate = useNavigate();

  const categories = ["all", "modern", "classic", "minimal", "creative"];

  useEffect(() => {
    loadTemplates();
  }, []);

  useEffect(() => {
    filterTemplates();
  }, [searchQuery, selectedCategory, templates]);

  const loadTemplates = async () => {
    try {
      const data = await templateService.getAllTemplates();
      setTemplates(data);
      setFilteredTemplates(data);
    } catch (error) {
      console.error("Error loading templates:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterTemplates = () => {
    let filtered = templates;

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (t) => t.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Filter by search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (t) =>
          t.name.toLowerCase().includes(query) ||
          t.description.toLowerCase().includes(query) ||
          t.category.toLowerCase().includes(query)
      );
    }

    setFilteredTemplates(filtered);
  };

  const handleSelectTemplate = (templateId: string) => {
    navigate(`/resumes/new?template=${templateId}`);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Choose Your Template
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Select from our collection of professionally designed templates
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                selectedCategory === category
                  ? "bg-primary-600 text-white dark:bg-primary-500"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        <div className="w-full sm:w-64">
          <Input
            placeholder="Search templates..."
            icon={<Search className="h-4 w-4" />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Showing {filteredTemplates.length} template{filteredTemplates.length !== 1 ? "s" : ""}
      </p>

      {/* Templates Grid */}
      {filteredTemplates.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <LayoutTemplate className="h-12 w-12 text-gray-400 dark:text-gray-600" />
          <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
            No templates found
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Try adjusting your search or filter
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredTemplates.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card hover className="overflow-hidden p-0">
                <div className="relative">
                  <div className="aspect-[3/4] w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                    <img
                      src={
                        template.previewImageUrl ||
                        "https://placehold.co/400x500/3b82f6/ffffff?text=Template"
                      }
                      alt={template.name}
                      className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>

                  {/* Badges */}
                  <div className="absolute left-3 top-3 flex flex-col gap-1.5">
                    {template.premium && (
                      <Badge variant="premium" size="sm">
                        <Star className="mr-1 h-3 w-3" />
                        Premium
                      </Badge>
                    )}
                    <Badge variant="info" size="sm">
                      {template.category}
                    </Badge>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="mb-1 font-semibold text-gray-900 dark:text-white">
                    {template.name}
                  </h3>
                  <p className="mb-3 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                    {template.description}
                  </p>

                  <Button
                    fullWidth
                    size="sm"
                    onClick={() => handleSelectTemplate(template.id)}
                    icon={<Check className="h-4 w-4" />}
                  >
                    Use This Template
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Premium CTA */}
      <Card className="bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border-amber-200 dark:border-amber-800">
        <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Want more templates?
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Upgrade to Premium to unlock all templates and advanced features
            </p>
          </div>
          <Button variant="primary" icon={<Sparkles className="h-4 w-4" />}>
            Upgrade to Premium
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default TemplatesPage;