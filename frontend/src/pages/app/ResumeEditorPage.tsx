import React, { useState, useEffect, useRef } from "react";
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
  Check,
  Eye,
  Edit3,
  FileText,
  Briefcase,
  GraduationCap,
} from "lucide-react";
import { resumeService } from "../../services/resume.service";
import { templateService } from "../../services/template.service";
import { aiService } from "../../services/ai.service";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import TextArea from "../../components/common/TextArea";
import Loader from "../../components/common/Loader";
import Badge from "../../components/common/Badge";
import Modal from "../../components/common/Modal";
import toast from "react-hot-toast";
import type { ResumeData } from "../../types/resume";
import type { Template } from "../../types/template";

// LinkedIn SVG Icon
const LinkedInIconSVG = () => (
  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const resumeEditorSchema = z.object({
  title: z.string().min(1, "Title is required"),
  templateId: z.string().min(1, "Please select a template"),
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  location: z.string().min(1, "Location is required"),
  linkedin: z.string().optional(),
  summary: z.string().min(10, "Summary must be at least 10 characters"),
  skills: z.string().min(1, "At least one skill is required"),
  experience: z.string().optional(),
  education: z.string().optional(),
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
  const [lastSaved, setLastSaved] = useState<string>("");
  const [activeSection, setActiveSection] = useState<string>("personal");
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    watch,
    setValue,
    reset,
    getValues,
  } = useForm<ResumeEditorFormData>({
    resolver: zodResolver(resumeEditorSchema),
    defaultValues: {
      experience: "",
      education: "",
    },
  });

  useEffect(() => {
    if (resumeId) {
      loadData();
    }
  }, [resumeId]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const templatesData = await templateService.getAllTemplates();
      setTemplates(templatesData);

      const resume = await resumeService.getResumeById(parseInt(resumeId!));
      const parsedData = JSON.parse(resume.resumeDataJson) as ResumeData;
      setResumeData(parsedData);
      setSelectedTemplate(resume.templateId);

      reset({
        title: resume.title,
        templateId: resume.templateId,
        fullName: parsedData.personalInfo.fullName || "",
        email: parsedData.personalInfo.email || "",
        phone: parsedData.personalInfo.phone || "",
        location: parsedData.personalInfo.location || "",
        linkedin: parsedData.personalInfo.linkedin || "",
        summary: parsedData.summary || "",
        skills: parsedData.skills?.join(", ") || "",
        experience: parsedData.experience?.map(e => 
          `${e.company} | ${e.position} | ${e.startDate} - ${e.endDate || "Present"} | ${e.description}`
        ).join("\n\n") || "",
        education: parsedData.education?.map(e =>
          `${e.institution} | ${e.degree} | ${e.field} | ${e.startDate} - ${e.endDate || "Present"}`
        ).join("\n\n") || "",
      });

      setLastSaved(new Date(resume.updatedAt).toLocaleString());
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Failed to load resume. Please try again.");
      navigate("/dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: ResumeEditorFormData) => {
    setIsSaving(true);
    try {
      const experienceEntries = data.experience ? data.experience.split("\n\n").filter(Boolean).map(entry => {
        const parts = entry.split(" | ");
        return {
          company: parts[0] || "",
          position: parts[1] || "",
          startDate: parts[2]?.split(" - ")[0] || "",
          endDate: parts[2]?.split(" - ")[1] || "",
          description: parts[3] || "",
        };
      }) : [];

      const educationEntries = data.education ? data.education.split("\n\n").filter(Boolean).map(entry => {
        const parts = entry.split(" | ");
        return {
          institution: parts[0] || "",
          degree: parts[1] || "",
          field: parts[2] || "",
          startDate: parts[3]?.split(" - ")[0] || "",
          endDate: parts[3]?.split(" - ")[1] || "",
        };
      }) : [];

      const resumeDataToSave: ResumeData = {
        personalInfo: {
          fullName: data.fullName,
          email: data.email,
          phone: data.phone,
          location: data.location,
          linkedin: data.linkedin || "",
        },
        skills: data.skills.split(",").map((s) => s.trim()).filter(Boolean),
        summary: data.summary,
        experience: experienceEntries,
        education: educationEntries,
      };

      const payload = {
        title: data.title,
        templateId: data.templateId,
        resumeDataJson: JSON.stringify(resumeDataToSave),
      };

      await resumeService.updateResume(parseInt(resumeId!), payload);
      setLastSaved(new Date().toLocaleString());
      toast.success("Resume saved successfully! ✅");
    } catch (error) {
      console.error("Error updating resume:", error);
      toast.error("Failed to update resume. Please try again.");
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
      toast.success("Resume deleted successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error deleting resume:", error);
      toast.error("Failed to delete resume. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAiImprove = () => {
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
      toast.error("Failed to improve resume. Please try again.");
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
      linkedin: aiResult.personalInfo.linkedin || "",
      summary: aiResult.summary || "",
      skills: aiResult.skills?.join(", ") || "",
    });
    setShowAiComparison(false);
    setIsAiModalOpen(false);
    setAiResult(null);
    toast.success("AI changes applied! Click Save to persist.");
  };

  const watchedTemplateId = watch("templateId");
  const watchedFullName = watch("fullName");
  const watchedEmail = watch("email");
  const watchedPhone = watch("phone");
  const watchedLocation = watch("location");
  const watchedLinkedin = watch("linkedin");
  const watchedSummary = watch("summary");
  const watchedSkills = watch("skills");

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Google Docs Style Top Bar */}
      <div className="sticky top-0 z-50 border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 shadow-sm">
        <div className="flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/dashboard")}
              icon={<ArrowLeft className="h-4 w-4" />}
            >
              <span className="hidden sm:inline">Dashboard</span>
            </Button>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary-600" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate max-w-[150px] sm:max-w-[300px]">
                {watch("title") || "Untitled Resume"}
              </span>
              {isDirty && (
                <Badge variant="warning" size="sm" className="ml-2">
                  Unsaved
                </Badge>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <span className="hidden md:inline text-xs text-gray-400 dark:text-gray-500">
              {lastSaved && `Last saved: ${lastSaved}`}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsPreviewMode(!isPreviewMode)}
              icon={isPreviewMode ? <Edit3 className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              className="hidden sm:flex"
            >
              {isPreviewMode ? "Edit" : "Preview"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleAiImprove}
              icon={<Sparkles className="h-4 w-4" />}
            >
              <span className="hidden sm:inline">AI Improve</span>
            </Button>
            <Button
              size="sm"
              onClick={handleSubmit(onSubmit)}
              loading={isSaving}
              icon={<Save className="h-4 w-4" />}
            >
              <span className="hidden sm:inline">Save</span>
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleDelete}
              loading={isDeleting}
              icon={<Trash2 className="h-4 w-4" />}
            />
          </div>
        </div>
      </div>

      {/* Main Content - Full Page Google Docs Style */}
      <div className="flex h-[calc(100vh-56px)]">
        {/* Left Sidebar - Document Outline */}
        <div className="hidden w-64 border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 lg:block overflow-y-auto p-4">
          <div className="mb-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
              Document Outline
            </h3>
          </div>
          <nav className="space-y-1">
            <button
              onClick={() => scrollToSection("personal")}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                activeSection === "personal"
                  ? "bg-primary-50 text-primary-700 dark:bg-primary-950/30 dark:text-primary-400"
                  : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
              }`}
            >
              <User className="inline h-4 w-4 mr-2" />
              Personal Info
            </button>
            <button
              onClick={() => scrollToSection("summary")}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                activeSection === "summary"
                  ? "bg-primary-50 text-primary-700 dark:bg-primary-950/30 dark:text-primary-400"
                  : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
              }`}
            >
              <FileText className="inline h-4 w-4 mr-2" />
              Summary
            </button>
            <button
              onClick={() => scrollToSection("skills")}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                activeSection === "skills"
                  ? "bg-primary-50 text-primary-700 dark:bg-primary-950/30 dark:text-primary-400"
                  : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
              }`}
            >
              <Code className="inline h-4 w-4 mr-2" />
              Skills
            </button>
            <button
              onClick={() => scrollToSection("experience")}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                activeSection === "experience"
                  ? "bg-primary-50 text-primary-700 dark:bg-primary-950/30 dark:text-primary-400"
                  : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
              }`}
            >
              <Briefcase className="inline h-4 w-4 mr-2" />
              Experience
            </button>
            <button
              onClick={() => scrollToSection("education")}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                activeSection === "education"
                  ? "bg-primary-50 text-primary-700 dark:bg-primary-950/30 dark:text-primary-400"
                  : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
              }`}
            >
              <GraduationCap className="inline h-4 w-4 mr-2" />
              Education
            </button>
          </nav>
        </div>

        {/* Center - Document Editor */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-4xl space-y-6">
            {/* Google Docs Style Document */}
            <div className="rounded-lg bg-white shadow-lg dark:bg-gray-900 p-8 sm:p-12">
              {/* Title Section */}
              <div className="mb-8 border-b border-gray-200 pb-4 dark:border-gray-700">
                <Input
                  label="Resume Title"
                  placeholder="Software Engineer Resume"
                  className="text-2xl font-bold border-0 px-0 focus:ring-0"
                  error={errors.title?.message}
                  {...register("title")}
                />
              </div>

              {/* Personal Information */}
              <div id="personal" className="mb-8 scroll-mt-16">
                <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <User className="h-5 w-5" /> Personal Information
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    label="Full Name"
                    placeholder="John Doe"
                    error={errors.fullName?.message}
                    {...register("fullName")}
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="john@example.com"
                    error={errors.email?.message}
                    {...register("email")}
                  />
                  <Input
                    label="Phone Number"
                    placeholder="+1 234 567 890"
                    error={errors.phone?.message}
                    {...register("phone")}
                  />
                  <Input
                    label="Location"
                    placeholder="New York, NY"
                    error={errors.location?.message}
                    {...register("location")}
                  />
                  <div className="sm:col-span-2">
                    <Input
                      label="LinkedIn Profile (Optional)"
                      placeholder="linkedin.com/in/johndoe"
                      icon={<LinkedInIconSVG />}
                      error={errors.linkedin?.message}
                      {...register("linkedin")}
                    />
                  </div>
                </div>
              </div>

              {/* Professional Summary */}
              <div id="summary" className="mb-8 scroll-mt-16">
                <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <FileText className="h-5 w-5" /> Professional Summary
                </h2>
                <TextArea
                  placeholder="Write a compelling professional summary that highlights your key skills, experience, and career goals..."
                  rows={5}
                  error={errors.summary?.message}
                  {...register("summary")}
                />
                <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
                  {watch("summary")?.length || 0}/500 characters
                </p>
              </div>

              {/* Skills */}
              <div id="skills" className="mb-8 scroll-mt-16">
                <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Code className="h-5 w-5" /> Skills
                </h2>
                <Input
                  placeholder="JavaScript, React, Node.js, Python"
                  error={errors.skills?.message}
                  {...register("skills")}
                />
                <div className="mt-3 flex flex-wrap gap-2">
                  {watch("skills")?.split(",").map((skill, index) => (
                    skill.trim() && (
                      <span key={index} className="inline-flex items-center gap-1 rounded-full bg-primary-100 px-3 py-1 text-sm font-medium text-primary-700 dark:bg-primary-900/30 dark:text-primary-400">
                        {skill.trim()}
                      </span>
                    )
                  ))}
                </div>
                <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
                  Enter skills separated by commas
                </p>
              </div>

              {/* Experience */}
              <div id="experience" className="mb-8 scroll-mt-16">
                <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Briefcase className="h-5 w-5" /> Experience
                </h2>
                <TextArea
                  placeholder="Company Name | Position | Start Date - End Date | Description&#10;&#10;Example:&#10;Google | Software Engineer | 2020 - 2023 | Built scalable web applications..."
                  rows={6}
                  {...register("experience")}
                />
                <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
                  Format: Company | Position | Start - End | Description (separate entries with blank line)
                </p>
              </div>

              {/* Education */}
              <div id="education" className="mb-8 scroll-mt-16">
                <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" /> Education
                </h2>
                <TextArea
                  placeholder="Institution | Degree | Field | Start Date - End Date&#10;&#10;Example:&#10;MIT | B.S. | Computer Science | 2016 - 2020"
                  rows={4}
                  {...register("education")}
                />
                <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
                  Format: Institution | Degree | Field | Start - End (separate entries with blank line)
                </p>
              </div>
            </div>

            {/* Save Button at bottom */}
            <div className="flex justify-end gap-3 pb-8">
              <Button
                type="submit"
                loading={isSaving}
                icon={<Save className="h-4 w-4" />}
                size="lg"
              >
                Save Changes
              </Button>
            </div>
          </form>
        </div>

        {/* Right Sidebar - Live Preview */}
        <div className="hidden w-96 border-l border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 xl:block overflow-y-auto p-4">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Live Preview</h3>
            <Badge variant="info" size="sm">
              {templates.find(t => t.id === watchedTemplateId)?.name || "Modern"}
            </Badge>
          </div>

          <div className="sticky top-4">
            <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-4">
              <div className="aspect-[3/4] w-full bg-white dark:bg-gray-800 rounded shadow-sm p-6">
                <div className="h-full space-y-4">
                  <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      {watchedFullName || "Your Name"}
                    </h2>
                    <div className="mt-1 space-y-0.5 text-xs text-gray-500 dark:text-gray-400">
                      <p>{watchedEmail || "email@example.com"}</p>
                      <p>{watchedPhone || "+1 234 567 890"}</p>
                      <p>{watchedLocation || "City, Country"}</p>
                      {watchedLinkedin && (
                        <p className="text-primary-600 dark:text-primary-400">{watchedLinkedin}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Summary
                    </h4>
                    <p className="mt-1 text-sm text-gray-700 dark:text-gray-300 line-clamp-4">
                      {watchedSummary || "Your professional summary will appear here..."}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Skills
                    </h4>
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      {watchedSkills?.split(",").map((skill, index) => (
                        skill.trim() && (
                          <span key={index} className="rounded-full bg-primary-100 px-2 py-0.5 text-xs font-medium text-primary-700 dark:bg-primary-900/30 dark:text-primary-400">
                            {skill.trim()}
                          </span>
                        )
                      ))}
                      {(!watchedSkills || watchedSkills.trim() === "") && (
                        <span className="text-xs text-gray-400">Your skills will appear here</span>
                      )}
                    </div>
                  </div>

                  <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-auto">
                    <p className="text-center text-[10px] text-gray-400 dark:text-gray-500">
                      {templates.find(t => t.id === watchedTemplateId)?.name || "Modern"} • ATS-Friendly
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
        title="✨ AI Resume Enhancement"
        size="lg"
      >
        {!showAiComparison ? (
          <div className="space-y-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Enter your target role and experience level to get AI-powered suggestions
              to improve your resume content.
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
                    toast.error("Please enter your target role.");
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
              <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                <h4 className="mb-3 font-medium text-gray-700 dark:text-gray-300">📄 Original</h4>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Summary</p>
                    <p className="text-gray-700 dark:text-gray-300">{resumeData?.summary}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Skills</p>
                    <p className="text-gray-700 dark:text-gray-300">{resumeData?.skills?.join(", ")}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-primary-200 bg-primary-50 p-4 dark:border-primary-800 dark:bg-primary-950/20">
                <h4 className="mb-3 font-medium text-primary-700 dark:text-primary-300 flex items-center gap-2">
                  <Sparkles className="h-4 w-4" /> Improved
                </h4>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-xs font-medium text-primary-600 dark:text-primary-400">Summary</p>
                    <p className="text-gray-700 dark:text-gray-300">{aiResult?.summary}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-primary-600 dark:text-primary-400">Skills</p>
                    <p className="text-gray-700 dark:text-gray-300">{aiResult?.skills?.join(", ")}</p>
                  </div>
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