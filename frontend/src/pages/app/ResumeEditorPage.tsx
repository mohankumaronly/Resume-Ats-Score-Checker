import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ArrowLeft,
  Save,
  Trash2,
  Sparkles,
  User,
  Mail,
  Phone,
  MapPin,
  Code,
  Briefcase,
  Eye,
  Edit3,
  X,
  Check,
  Loader2,
} from "lucide-react";
import { resumeService } from "../../services/resume.service";
import { templateService } from "../../services/template.service";
import { aiService } from "../../services/ai.service";
// import { Template } from "../../types/template";
// import { ResumeData, ResumeDetail } from "../../types/resume";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import TextArea from "../../components/common/TextArea";
import Card from "../../components/common/Card";
import Loader from "../../components/common/Loader";
import Badge from "../../components/common/Badge";
import Modal from "../../components/common/Modal";
import type { Template } from "../../types/template";
import type { ResumeData } from "../../types/resume";

const resumeEditorSchema = z.object({
  title: z.string().min(1, "Title is required"),
  templateId: z.string().min(1, "Please select a template"),
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  location: z.string().min(1, "Location is required"),
  summary: z.string().min(10, "Summary must be at least 10 characters"),
  skills: z.string().min(1, "At least one skill is required"),
});

type ResumeEditorFormData = z.infer<typeof resumeEditorSchema>;

const ResumeEditorPage: React.FC = () => {
  const { resumeId } = useParams<{ resumeId: string }>();
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("modern-1");
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [aiResult, setAiResult] = useState<ResumeData | null>(null);
  const [showAiComparison, setShowAiComparison] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    getValues,
    reset,
  } = useForm<ResumeEditorFormData>({
    resolver: zodResolver(resumeEditorSchema),
  });

  useEffect(() => {
    if (resumeId) {
      loadData();
    }
  }, [resumeId]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Load templates
      const templatesData = await templateService.getAllTemplates();
      setTemplates(templatesData);

      // Load resume
      const resume = await resumeService.getResumeById(parseInt(resumeId!));
      const parsedData = JSON.parse(resume.resumeDataJson) as ResumeData;
      setResumeData(parsedData);
      setSelectedTemplate(resume.templateId);

      // Populate form
      reset({
        title: resume.title,
        templateId: resume.templateId,
        fullName: parsedData.personalInfo.fullName || "",
        email: parsedData.personalInfo.email || "",
        phone: parsedData.personalInfo.phone || "",
        location: parsedData.personalInfo.location || "",
        summary: parsedData.summary || "",
        skills: parsedData.skills?.join(", ") || "",
      });
    } catch (error) {
      console.error("Error loading data:", error);
      alert("Failed to load resume. Please try again.");
      navigate("/dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: ResumeEditorFormData) => {
    setIsSaving(true);
    try {
      const resumeDataToSave: ResumeData = {
        personalInfo: {
          fullName: data.fullName,
          email: data.email,
          phone: data.phone,
          location: data.location,
        },
        skills: data.skills.split(",").map((s) => s.trim()).filter(Boolean),
        summary: data.summary,
      };

      const payload = {
        title: data.title,
        templateId: data.templateId,
        resumeDataJson: JSON.stringify(resumeDataToSave),
      };

      await resumeService.updateResume(parseInt(resumeId!), payload);
      alert("Resume updated successfully!");
    } catch (error) {
      console.error("Error updating resume:", error);
      alert("Failed to update resume. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this resume? This action cannot be undone.")) {
      return;
    }

    setIsDeleting(true);
    try {
      await resumeService.deleteResume(parseInt(resumeId!));
      navigate("/dashboard");
    } catch (error) {
      console.error("Error deleting resume:", error);
      alert("Failed to delete resume. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAiImprove = async () => {
    setIsAiModalOpen(true);
  };

  const handleAiSubmit = async (targetRole: string, experienceLevel: string) => {
    setIsAiLoading(true);
    try {
      const result = await aiService.improveResume(parseInt(resumeId!), {
        targetRole,
        experienceLevel: experienceLevel as any,
      });

      const improvedData = JSON.parse(result.improvedResumeDataJson) as ResumeData;
      setAiResult(improvedData);
      setShowAiComparison(true);
    } catch (error) {
      console.error("Error improving resume:", error);
      alert("Failed to improve resume. Please try again.");
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleApplyAiChanges = () => {
    if (!aiResult) return;

    setResumeData(aiResult);
    reset({
      ...getValues(),
      fullName: aiResult.personalInfo.fullName || "",
      email: aiResult.personalInfo.email || "",
      phone: aiResult.personalInfo.phone || "",
      location: aiResult.personalInfo.location || "",
      summary: aiResult.summary || "",
      skills: aiResult.skills?.join(", ") || "",
    });
    setShowAiComparison(false);
    setIsAiModalOpen(false);
    setAiResult(null);
    alert("AI changes applied! Click Save to persist the changes.");
  };

  const watchedTemplateId = watch("templateId");

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
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/dashboard")}
            icon={<ArrowLeft className="h-4 w-4" />}
          >
            Back
          </Button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Edit Resume
          </h1>
          <Badge variant="info" size="sm">
            {templates.find(t => t.id === watchedTemplateId)?.name || "Template"}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleAiImprove}
            icon={<Sparkles className="h-4 w-4" />}
          >
            Improve with AI
          </Button>
          <Button
            type="submit"
            form="resume-editor-form"
            loading={isSaving}
            icon={<Save className="h-4 w-4" />}
          >
            Save
          </Button>
          <Button
            variant="danger"
            onClick={handleDelete}
            loading={isDeleting}
            icon={<Trash2 className="h-4 w-4" />}
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Form */}
        <div className="lg:col-span-2">
          <form id="resume-editor-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Resume Title */}
            <Card>
              <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                Resume Details
              </h3>
              <Input
                label="Resume Title"
                placeholder="e.g., Software Engineer Resume"
                error={errors.title?.message}
                {...register("title")}
              />
            </Card>

            {/* Template Selection */}
            <Card>
              <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                Select Template
              </h3>
              <div className="grid gap-3 sm:grid-cols-3">
                {templates.map((template) => (
                  <button
                    key={template.id}
                    type="button"
                    onClick={() => {
                      setSelectedTemplate(template.id);
                      setValue("templateId", template.id);
                    }}
                    className={`relative rounded-lg border-2 p-3 text-left transition-all ${
                      watchedTemplateId === template.id
                        ? "border-primary-500 bg-primary-50 dark:border-primary-400 dark:bg-primary-950/30"
                        : "border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600"
                    }`}
                  >
                    <div className="aspect-[3/4] w-full rounded bg-gray-100 dark:bg-gray-800 mb-2 overflow-hidden">
                      <img
                        src={template.previewImageUrl || "https://placehold.co/400x500/e5e7eb/6b7280?text=Template"}
                        alt={template.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {template.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {template.category}
                    </p>
                    {template.premium && (
                      <Badge variant="premium" size="sm" className="mt-1">
                        Premium
                      </Badge>
                    )}
                  </button>
                ))}
              </div>
              {errors.templateId && (
                <p className="mt-2 text-sm text-red-500">{errors.templateId.message}</p>
              )}
            </Card>

            {/* Personal Information */}
            <Card>
              <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                Personal Information
              </h3>
              <div className="space-y-4">
                <Input
                  label="Full Name"
                  placeholder="John Doe"
                  icon={<User className="h-4 w-4" />}
                  error={errors.fullName?.message}
                  {...register("fullName")}
                />
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="john@example.com"
                  icon={<Mail className="h-4 w-4" />}
                  error={errors.email?.message}
                  {...register("email")}
                />
                <Input
                  label="Phone Number"
                  placeholder="+1 234 567 890"
                  icon={<Phone className="h-4 w-4" />}
                  error={errors.phone?.message}
                  {...register("phone")}
                />
                <Input
                  label="Location"
                  placeholder="New York, NY"
                  icon={<MapPin className="h-4 w-4" />}
                  error={errors.location?.message}
                  {...register("location")}
                />
              </div>
            </Card>

            {/* Professional Summary */}
            <Card>
              <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                Professional Summary
              </h3>
              <TextArea
                placeholder="Write a brief summary of your professional experience, skills, and career goals..."
                rows={4}
                error={errors.summary?.message}
                {...register("summary")}
              />
            </Card>

            {/* Skills */}
            <Card>
              <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                Skills
              </h3>
              <Input
                placeholder="e.g., JavaScript, React, Node.js, Python"
                icon={<Code className="h-4 w-4" />}
                error={errors.skills?.message}
                {...register("skills")}
              />
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Enter your skills separated by commas (e.g., JavaScript, React, Node.js)
              </p>
            </Card>
          </form>
        </div>

        {/* Live Preview */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              Live Preview
            </h3>
            <div className="aspect-[3/4] w-full rounded-lg bg-gray-100 dark:bg-gray-800 p-4">
              <div className="space-y-3">
                <div className="border-b border-gray-300 dark:border-gray-700 pb-2">
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {watch("fullName") || "Your Name"}
                  </p>
                  <div className="text-xs text-gray-500 dark:text-gray-400 space-y-0.5">
                    <p>{watch("email") || "email@example.com"}</p>
                    <p>{watch("phone") || "+1 234 567 890"}</p>
                    <p>{watch("location") || "City, Country"}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">Summary</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-3">
                    {watch("summary") || "Your professional summary will appear here..."}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">Skills</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {watch("skills")?.split(",").map((skill, index) => (
                      skill.trim() && (
                        <span key={index} className="rounded bg-primary-100 px-1.5 py-0.5 text-[10px] text-primary-700 dark:bg-primary-900/30 dark:text-primary-400">
                          {skill.trim()}
                        </span>
                      )
                    ))}
                    {!watch("skills") && (
                      <span className="text-xs text-gray-400">Your skills will appear here</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <p className="mt-3 text-center text-xs text-gray-500 dark:text-gray-400">
              Template: {templates.find(t => t.id === watchedTemplateId)?.name || "Modern"}
            </p>
          </Card>
        </div>
      </div>

      {/* AI Improve Modal */}
      <Modal
        isOpen={isAiModalOpen}
        onClose={() => {
          setIsAiModalOpen(false);
          setShowAiComparison(false);
          setAiResult(null);
        }}
        title="Improve with AI"
        size="lg"
      >
        {!showAiComparison ? (
          <div className="space-y-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Enter your target role and experience level to get AI-powered suggestions
              to improve your resume.
            </p>

            <div className="space-y-4">
              <Input
                label="Target Role"
                placeholder="e.g., Java Backend Developer"
                id="targetRole"
                defaultValue=""
              />
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Experience Level
                </label>
                <select
                  id="experienceLevel"
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                  defaultValue="fresher"
                >
                  <option value="fresher">Fresher</option>
                  <option value="mid-level">Mid-Level</option>
                  <option value="senior">Senior</option>
                  <option value="lead">Lead</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button
                variant="ghost"
                onClick={() => setIsAiModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  const targetRole = (document.getElementById("targetRole") as HTMLInputElement)?.value;
                  const experienceLevel = (document.getElementById("experienceLevel") as HTMLSelectElement)?.value;
                  if (targetRole && experienceLevel) {
                    handleAiSubmit(targetRole, experienceLevel);
                  } else {
                    alert("Please enter your target role.");
                  }
                }}
                loading={isAiLoading}
                icon={<Sparkles className="h-4 w-4" />}
              >
                Generate Improvements
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              {/* Original */}
              <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                <h4 className="mb-3 font-medium text-gray-700 dark:text-gray-300">Original</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Summary:</strong> {resumeData?.summary}</p>
                  <p><strong>Skills:</strong> {resumeData?.skills?.join(", ")}</p>
                </div>
              </div>

              {/* Improved */}
              <div className="rounded-lg border border-primary-200 bg-primary-50 p-4 dark:border-primary-800 dark:bg-primary-950/20">
                <h4 className="mb-3 font-medium text-primary-700 dark:text-primary-300">Improved</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Summary:</strong> {aiResult?.summary}</p>
                  <p><strong>Skills:</strong> {aiResult?.skills?.join(", ")}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button
                variant="ghost"
                onClick={() => {
                  setShowAiComparison(false);
                  setAiResult(null);
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleApplyAiChanges}
                icon={<Check className="h-4 w-4" />}
              >
                Apply Changes
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ResumeEditorPage;