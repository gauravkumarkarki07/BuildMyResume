import type { TemplateProps } from "../ResumePreview";

export function ProfessionalTemplate({ data }: TemplateProps) {
  const { personalInfo, summary, workExperiences, educations, skills, projects, certifications } = data;

  return (
    <div className="p-10 text-[#333]" style={{ fontFamily: "system-ui, sans-serif" }}>
      {/* Header */}
      <div className="mb-6 border-b border-[#d4d4d4] pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-[#1a1a1a]">
          {personalInfo.fullName || "Your Name"}
        </h1>
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#555]">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
          {personalInfo.github && <span>{personalInfo.github}</span>}
          {personalInfo.website && <span>{personalInfo.website}</span>}
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div className="mb-5">
          <h2 className="mb-2 border-b border-[#d4d4d4] pb-1 text-xs font-bold uppercase tracking-widest text-[#1a1a1a]">
            Professional Summary
          </h2>
          <p className="text-sm leading-relaxed text-[#444]">{summary}</p>
        </div>
      )}

      {/* Work Experience */}
      {workExperiences.length > 0 && (
        <div className="mb-5">
          <h2 className="mb-3 border-b border-[#d4d4d4] pb-1 text-xs font-bold uppercase tracking-widest text-[#1a1a1a]">
            Experience
          </h2>
          {workExperiences.map((exp) => (
            <div key={exp.id} className="mb-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[#1a1a1a]">{exp.title}</h3>
                  <p className="text-xs text-[#555]">{exp.company}{exp.location ? `, ${exp.location}` : ""}</p>
                </div>
                <span className="shrink-0 text-xs text-[#666]">
                  {exp.startDate} — {exp.current ? "Present" : exp.endDate}
                </span>
              </div>
              {exp.description && (
                <p className="mt-1 whitespace-pre-line text-xs leading-relaxed text-[#444]">{exp.description}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {educations.length > 0 && (
        <div className="mb-5">
          <h2 className="mb-3 border-b border-[#d4d4d4] pb-1 text-xs font-bold uppercase tracking-widest text-[#1a1a1a]">
            Education
          </h2>
          {educations.map((edu) => (
            <div key={edu.id} className="mb-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[#1a1a1a]">
                    {edu.degree}{edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ""}
                  </h3>
                  <p className="text-xs text-[#555]">{edu.institution}{edu.location ? `, ${edu.location}` : ""}</p>
                </div>
                <span className="shrink-0 text-xs text-[#666]">
                  {edu.startDate} — {edu.current ? "Present" : edu.endDate}
                </span>
              </div>
              {edu.gpa && <p className="text-xs text-[#555]">GPA: {edu.gpa}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div className="mb-5">
          <h2 className="mb-2 border-b border-[#d4d4d4] pb-1 text-xs font-bold uppercase tracking-widest text-[#1a1a1a]">
            Skills
          </h2>
          <p className="text-sm text-[#444]">
            {skills.map((s) => s.name).join(", ")}
          </p>
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div className="mb-5">
          <h2 className="mb-3 border-b border-[#d4d4d4] pb-1 text-xs font-bold uppercase tracking-widest text-[#1a1a1a]">
            Projects
          </h2>
          {projects.map((proj) => (
            <div key={proj.id} className="mb-3">
              <h3 className="text-sm font-bold text-[#1a1a1a]">{proj.name}</h3>
              {proj.description && <p className="text-xs leading-relaxed text-[#444]">{proj.description}</p>}
              {proj.url && <p className="mt-0.5 text-xs text-[#666]">{proj.url}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <div className="mb-5">
          <h2 className="mb-3 border-b border-[#d4d4d4] pb-1 text-xs font-bold uppercase tracking-widest text-[#1a1a1a]">
            Certifications
          </h2>
          {certifications.map((cert) => (
            <div key={cert.id} className="mb-2">
              <h3 className="text-sm font-bold text-[#1a1a1a]">{cert.name}</h3>
              <p className="text-xs text-[#555]">{cert.issuer} — {cert.issueDate}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
