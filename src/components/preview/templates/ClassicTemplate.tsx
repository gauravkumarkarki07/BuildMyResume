import type { TemplateProps } from "../ResumePreview";

export function ClassicTemplate({ data }: TemplateProps) {
  const { personalInfo, summary, workExperiences, educations, skills, projects, certifications } = data;

  return (
    <div className="p-12 text-gray-900" style={{ fontFamily: "Georgia, serif" }}>
      {/* Header */}
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold tracking-wide">
          {personalInfo.fullName || "Your Name"}
        </h1>
        <div className="mt-2 flex flex-wrap justify-center gap-2 text-sm text-gray-600">
          {[personalInfo.email, personalInfo.phone, personalInfo.location]
            .filter(Boolean)
            .map((item, i) => (
              <span key={i}>
                {i > 0 && <span className="mx-1">|</span>}
                {item}
              </span>
            ))}
        </div>
        <div className="mt-1 flex flex-wrap justify-center gap-2 text-sm text-gray-500">
          {[personalInfo.linkedin, personalInfo.github, personalInfo.website]
            .filter(Boolean)
            .map((item, i) => (
              <span key={i}>
                {i > 0 && <span className="mx-1">|</span>}
                {item}
              </span>
            ))}
        </div>
      </div>

      <hr className="mb-4 border-gray-300" />

      {/* Summary */}
      {summary && (
        <div className="mb-5">
          <h2 className="mb-2 text-sm font-bold uppercase tracking-widest text-gray-700">Professional Summary</h2>
          <p className="text-sm leading-relaxed">{summary}</p>
        </div>
      )}

      {/* Work Experience */}
      {workExperiences.length > 0 && (
        <div className="mb-5">
          <h2 className="mb-3 border-b border-gray-300 pb-1 text-sm font-bold uppercase tracking-widest text-gray-700">Experience</h2>
          {workExperiences.map((exp) => (
            <div key={exp.id} className="mb-4">
              <div className="flex justify-between">
                <strong>{exp.title}</strong>
                <span className="text-sm italic text-gray-500">
                  {exp.startDate} — {exp.current ? "Present" : exp.endDate}
                </span>
              </div>
              <p className="text-sm italic text-gray-600">{exp.company}{exp.location ? `, ${exp.location}` : ""}</p>
              {exp.description && (
                <p className="mt-1 whitespace-pre-line text-sm leading-relaxed">{exp.description}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {educations.length > 0 && (
        <div className="mb-5">
          <h2 className="mb-3 border-b border-gray-300 pb-1 text-sm font-bold uppercase tracking-widest text-gray-700">Education</h2>
          {educations.map((edu) => (
            <div key={edu.id} className="mb-3">
              <div className="flex justify-between">
                <strong>{edu.degree}{edu.fieldOfStudy ? `, ${edu.fieldOfStudy}` : ""}</strong>
                <span className="text-sm italic text-gray-500">
                  {edu.startDate} — {edu.current ? "Present" : edu.endDate}
                </span>
              </div>
              <p className="text-sm italic text-gray-600">{edu.institution}</p>
              {edu.gpa && <p className="text-sm text-gray-600">GPA: {edu.gpa}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div className="mb-5">
          <h2 className="mb-2 border-b border-gray-300 pb-1 text-sm font-bold uppercase tracking-widest text-gray-700">Skills</h2>
          <p className="text-sm">{skills.map((s) => s.name).join(", ")}</p>
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div className="mb-5">
          <h2 className="mb-3 border-b border-gray-300 pb-1 text-sm font-bold uppercase tracking-widest text-gray-700">Projects</h2>
          {projects.map((proj) => (
            <div key={proj.id} className="mb-3">
              <strong>{proj.name}</strong>
              {proj.description && <p className="text-sm leading-relaxed">{proj.description}</p>}
              {proj.technologies.length > 0 && (
                <p className="text-xs italic text-gray-500">{proj.technologies.join(", ")}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <div className="mb-5">
          <h2 className="mb-3 border-b border-gray-300 pb-1 text-sm font-bold uppercase tracking-widest text-gray-700">Certifications</h2>
          {certifications.map((cert) => (
            <div key={cert.id} className="mb-2">
              <strong>{cert.name}</strong>
              <span className="text-sm text-gray-600"> — {cert.issuer}, {cert.issueDate}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
