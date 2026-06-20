import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, FileText, Calendar, Trash2, Edit, Sparkles } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { resumeService } from "../../services/resume.service";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import EmptyState from "../../components/common/EmptyState";
import Loader from "../../components/common/Loader";
import Badge from "../../components/common/Badge";
import { formatDate } from "../../utils/formatDate";
import type { ResumeSummary } from "../../types/resume";
// import { formatDate } from "../../utils/formatDate";

const DashboardPage: React.FC = () => {
  const [resumes, setResumes] = useState<ResumeSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadResumes();
  }, []);

  const loadResumes = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await resumeService.getAllResumes();
      setResumes(data);
    } catch (error) {
      setError("Failed to load resumes. Please try again.");
      console.error("Error loading resumes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this resume?")) return;

    try {
      await resumeService.deleteResume(id);
      setResumes(resumes.filter((r) => r.id !== id));
    } catch (error) {
      console.error("Error deleting resume:", error);
      alert("Failed to delete resume. Please try again.");
    }
  };

  const handleEdit = (id: number) => {
    navigate(`/resumes/${id}`);
  };

  const handleCreate = () => {
    navigate("/resumes/new");
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            My Resumes
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Welcome back, {user?.email || "User"}! You have {resumes.length} resume{resumes.length !== 1 ? "s" : ""}.
          </p>
        </div>
        <Button onClick={handleCreate} icon={<Plus className="h-4 w-4" />}>
          Create Resume
        </Button>
      </div>

      {/* Error State */}
      {error && (
        <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20">
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <Button variant="outline" size="sm" onClick={loadResumes} className="mt-2">
            Retry
          </Button>
        </Card>
      )}

      {/* Resume List */}
      {resumes.length === 0 ? (
        <EmptyState
          title="No Resumes Yet"
          description="Create your first resume to get started. Choose from our professional templates and build your resume in minutes."
          actionLabel="Create Your First Resume"
          onAction={handleCreate}
          icon={<FileText className="h-12 w-12 text-primary-600" />}
          className="min-h-[50vh]"
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {resumes.map((resume, index) => (
            <motion.div
              key={resume.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card hover className="group relative">
                <div className="flex h-full flex-col">
                  {/* Template Badge */}
                  <div className="mb-3">
                    <Badge variant="info" size="sm">
                      {resume.templateId.replace("-", " ").toUpperCase()}
                    </Badge>
                  </div>

                  {/* Title */}
                  <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white line-clamp-1">
                    {resume.title}
                  </h3>

                  {/* Date */}
                  <div className="mb-4 flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>Updated {formatDate(resume.updatedAt)}</span>
                  </div>

                  {/* Actions */}
                  <div className="mt-auto flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(resume.id)}
                      icon={<Edit className="h-3.5 w-3.5" />}
                      className="flex-1"
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleDelete(resume.id)}
                      icon={<Trash2 className="h-3.5 w-3.5" />}
                      className="px-3"
                    />
                  </div>

                  {/* AI Improvement Badge */}
                  <div className="absolute right-3 top-3">
                    <Badge variant="premium" size="sm">
                      <Sparkles className="mr-1 h-3 w-3" />
                      AI Ready
                    </Badge>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Quick Tips */}
      {resumes.length > 0 && (
        <Card className="bg-primary-50 dark:bg-primary-950/20 border-primary-200 dark:border-primary-800">
          <div className="flex items-start gap-3">
            <Sparkles className="mt-0.5 h-5 w-5 text-primary-600 dark:text-primary-400 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">
                AI Improvement Tip
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Select a resume and use the AI improvement feature to optimize it for your target role.
                Get personalized suggestions to make your resume stand out.
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default DashboardPage;