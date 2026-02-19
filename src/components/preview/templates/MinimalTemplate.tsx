import type { TemplateProps } from "../ResumePreview";

export function MinimalTemplate({ data }: TemplateProps) {
  const { personalInfo, summary, workExperiences, educations, skills, projects, certifications } = data;

  return (
    <div className="p-12 text-gray-800" style={{ fontFamily: "system-ui, sans-serif" }}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-light tracking-wide text-gray-900">
          {personalInfo.fullName || "Your Name"}
        </h1>
        <div className="mt-2 flex flex-wrap gap-4 text-xs text-gray-500">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
        </div>
        <div className="mt-1 flex flex-wrap gap-4 text-xs text-gray-400">
          {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
          {personalInfo.github && <span>{personalInfo.github}</span>}
          {personalInfo.website && <span>{personalInfo.website}</span>}
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div className="mb-6">
          <h2 className="mb-2 text-xs font-medium uppercase tracking-widest text-gray-400">Summary</h2>
          <p className="text-sm leading-relaxed text-gray-600">{summary}</p>
        </div>
      )}

      {/* Work Experience */}
      {workExperiences.length > 0 && (
        <div className="mb-6">
          <h2 className="mb-3 text-xs font-medium uppercase tracking-widest text-gray-400">Experience</h2>
          {workExperiences.map((exp) => (
            <div key={exp.id} className="mb-4">
              <div className="flex items-baseline justify-between">
                <span className="font-medium text-gray-900">{exp.title}</span>
                <span className="text-xs text-gray-400">
                  {exp.startDate} — {exp.current ? "Present" : exp.endDate}
                </span>
              </div>
              <p className="text-sm text-gray-500">{exp.company}{exp.location ? ` · ${exp.location}` : ""}</p>
              {exp.description && (
                <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-gray-600">{exp.description}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {educations.length > 0 && (
        <div className="mb-6">
          <h2 className="mb-3 text-xs font-medium uppercase tracking-widest text-gray-400">Education</h2>
          {educations.map((edu) => (
            <div key={edu.id} className="mb-3">
              <div className="flex items-baseline justify-between">
                <span className="font-medium text-gray-900">{edu.degree}{edu.fieldOfStudy ? ` · ${edu.fieldOfStudy}` : ""}</span>
                <span className="text-xs text-gray-400">
                  {edu.startDate} — {edu.current ? "Present" : edu.endDate}
                </span>
              </div>
              <p className="text-sm text-gray-500">{edu.institution}</p>
              {edu.gpa && <p className="text-xs text-gray-400">GPA: {edu.gpa}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div className="mb-6">
          <h2 className="mb-2 text-xs font-medium uppercase tracking-widest text-gray-400">Skills</h2>
          <p className="text-sm text-gray-600">{skills.map((s) => s.name).join(" · ")}</p>
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div className="mb-6">
          <h2 className="mb-3 text-xs font-medium uppercase tracking-widest text-gray-400">Projects</h2>
          {projects.map((proj) => (
            <div key={proj.id} className="mb-3">
              <span className="font-medium text-gray-900">{proj.name}</span>
              {proj.description && <p className="text-sm text-gray-600">{proj.description}</p>}
              {proj.url && <p className="text-xs text-gray-400">{proj.url}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <div className="mb-6">
          <h2 className="mb-3 text-xs font-medium uppercase tracking-widest text-gray-400">Certifications</h2>
          {certifications.map((cert) => (
            <div key={cert.id} className="mb-2">
              <span className="font-medium text-gray-900">{cert.name}</span>
              <span className="text-sm text-gray-500"> · {cert.issuer} · {cert.issueDate}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
