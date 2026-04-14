import React, { useState } from "react";
import {
  FiSend,
  FiUser,
  FiPhone,
  FiMapPin,
  FiBook,
  FiEdit3,
  FiShield,
  FiFileText,
  FiLayers,
  FiBox,
} from "react-icons/fi";
import {
  FiBookOpen,
  FiCode,
  FiAward,
  FiArrowRight,
  FiCheckCircle,
  FiMonitor,
  FiSmartphone,
  FiCpu,
  FiUserPlus,
  FiHelpCircle,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function DivyaComputerInstitute() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    course: "",
    description: "",
  });
  const [status, setStatus] = useState({ type: "", message: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "loading", message: "Submitting..." });

    const { error } = await supabase
      .from("student_requests")
      .insert([formData]);

    if (error) {
      setStatus({
        type: "error",
        message: "Something went wrong. Please try again.",
      });
    } else {
      setStatus({
        type: "success",
        message: "Request submitted successfully!",
      });
      setFormData({
        name: "",
        phone: "",
        address: "",
        course: "Software Development",
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFBF7] font-sans text-slate-900 scroll-smooth">
      {/* --- Navigation --- */}
      <nav className="flex items-center justify-between px-6 py-4 bg-white/90 backdrop-blur-lg border-b border-orange-100 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-400 rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-200">
            <FiMonitor size={24} />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tight text-slate-800 leading-none">
              DIVYA
            </span>
            <span className="text-xs font-bold text-orange-500 tracking-[0.2em]">
              COMPUTER INSTITUTE
            </span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-600">
          <a
            href="#courses"
            className="hover:text-orange-500 transition-colors"
          >
            Courses
          </a>
          <a href="#about" className="hover:text-orange-500 transition-colors">
            Why Us
          </a>
          <a href="#faq" className="hover:text-orange-500 transition-colors">
            Help
          </a>
          <button
            className="px-6 py-2.5 rounded-full bg-orange-500 text-white shadow-lg shadow-orange-200 hover:bg-orange-600 transition-all active:scale-95 flex items-center gap-2"
            onClick={() => navigate("/login")}
          >
            <FiUserPlus /> Login
          </button>
        </div>
      </nav>

      {/* --- Hero Section --- */}
      <header className="relative px-8 py-16 lg:py-28 overflow-hidden">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="z-10 text-center lg:text-left">
            <span className="inline-block px-4 py-1.5 rounded-full bg-orange-100 text-orange-600 text-xs font-extrabold uppercase tracking-widest mb-6 border border-orange-200">
              🚀 10+ Years of Excellence
            </span>
            <h1 className="text-5xl lg:text-7xl font-black leading-[1.1] mb-6 text-slate-900">
              Master the Digital{" "}
              <span className="text-orange-500">Universe.</span>
            </h1>
            <p className="text-lg text-slate-600 mb-10 leading-relaxed max-w-lg mx-auto lg:mx-0">
              From basic computing to high-end software development. Join Divya
              Computer Institute and turn your curiosity into a professional
              career.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                onClick={() => navigate("/courses")}
                className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold text-lg shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
              >
                Explore Courses <FiArrowRight />
              </button>
              <button className="px-8 py-4 bg-white text-orange-600 border-2 border-orange-100 rounded-2xl font-bold text-lg hover:border-orange-500 transition-all">
                Student Login
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-amber-200 rounded-full blur-3xl opacity-40 -z-10"></div>
            <div className="bg-gradient-to-tr from-orange-400 to-amber-300 p-3 rounded-[2.5rem] shadow-2xl">
              <div className="bg-white rounded-[2rem] overflow-hidden p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold">
                    JD
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">
                      Student Progress
                    </p>
                    <p className="text-xs text-slate-400">
                      Full Stack Web Development
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full w-[75%] bg-orange-500 rounded-full"></div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="h-16 bg-orange-50 rounded-xl border border-orange-100 flex items-center justify-center text-orange-500 font-bold text-xs uppercase text-center p-2">
                      HTML/CSS Complete
                    </div>
                    <div className="h-16 bg-orange-50 rounded-xl border border-orange-100 flex items-center justify-center text-orange-500 font-bold text-xs uppercase text-center p-2">
                      JS Basics Done
                    </div>
                    <div className="h-16 bg-slate-50 rounded-xl border border-dashed border-slate-200 flex items-center justify-center text-slate-400 font-bold text-xs uppercase text-center p-2">
                      React Next
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* --- Trust Stats --- */}
      <section id="stats" className="px-8 py-12 bg-white">
        <div className="max-w-6xl mx-auto flex flex-wrap justify-around gap-8 text-center border-y border-slate-100 py-12">
          <StatItem count="5000+" label="Students Taught" />
          <StatItem count="25+" label="Tech Courses" />
          <StatItem count="100%" label="Hands-on Lab" />
          <StatItem count="4.9/5" label="Student Rating" />
        </div>
      </section>

      {/* --- Courses Grid --- */}
      <section id="courses" className="px-8 py-24 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-black mb-4">
            Choose Your <span className="text-orange-500">Path.</span>
          </h2>
          <p className="text-slate-500 mb-16 max-w-2xl mx-auto">
            Expert-led courses designed to take you from a beginner to a tech
            professional.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <CourseCard
              icon={<FiShield />}
              color="bg-blue-600"
              title="CCC (Course on Computer Concepts)"
              desc="Master digital literacy. Essential for government jobs, covering OS, MS Office, and digital financial services."
            />

            <CourseCard
              icon={<FiAward />}
              color="bg-purple-700"
              title="O Level (IT)"
              desc="Year-long NIELIT diploma covering Python, Web Design, IoT, and IT Tools. Equivalent to a Foundation Level in IT."
            />
            <CourseCard
              icon={<FiFileText />}
              color="bg-emerald-600"
              title="Tally Prime with GST"
              desc="Professional accounting and inventory management. Learn GST invoicing, tax returns, and financial reporting."
            />

            <CourseCard
              icon={<FiLayers />}
              color="bg-orange-500"
              title="ADCA"
              desc="Advanced Diploma in Computer Applications. A comprehensive 6 months course covering Office, Tally, and DTP."
            />
            <CourseCard
              icon={<FiEdit3 />}
              color="bg-red-500"
              title="Hindi & English Typing"
              desc="Develop professional speed and accuracy. Includes Remington Gail and Mangal layouts for government exams."
            />

            <CourseCard
              icon={<FiBox />}
              color="bg-cyan-600"
              title="LibreOffice Suite"
              desc="Master the open-source alternative to MS Office. Learn Writer, Calc, and Impress for NIELIT exam standards."
            />
          </div>
        </div>
      </section>

      {/* --- Why Us Section --- */}
      <section
        id="about"
        className="px-8 py-24 bg-slate-900 text-white rounded-[3rem] mx-4 mb-24 overflow-hidden relative"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 blur-3xl rounded-full"></div>
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-black mb-8 leading-tight">
              Why Divya Computer <br />
              Institute?
            </h2>
            <div className="space-y-6">
              <Point
                icon={<FiCheckCircle className="text-orange-400" />}
                text="Industry-expert faculty with real-world dev experience."
              />
              <Point
                icon={<FiCheckCircle className="text-orange-400" />}
                text="Latest curriculum updated for 2026 standards."
              />
              <Point
                icon={<FiCheckCircle className="text-orange-400" />}
                text="Verified Certifications to boost your resume."
              />
              <Point
                icon={<FiCheckCircle className="text-orange-400" />}
                text="Flexible timings for school and college students."
              />
            </div>
          </div>
          <div className="bg-white/10 p-8 rounded-3xl backdrop-blur-sm border border-white/10">
            <FiAward size={48} className="text-orange-400 mb-6" />
            <h3 className="text-2xl font-bold mb-4">Development Knowledge</h3>
            <p className="text-slate-300 leading-relaxed">
              We don't just teach software; we teach you how to build it. Our
              founder brings years of professional development experience to the
              classroom, giving students insights that books can't provide.
            </p>
          </div>
        </div>
      </section>

      {/* --- FAQ Section --- */}
      <section id="faq" className="px-8 py-24">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col items-center gap-3 mb-12 text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-500">
              <FiHelpCircle size={28} />
            </div>
            <h2 className="text-3xl font-black">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-4">
            <FAQItem
              question="Do I need my own laptop?"
              answer="While we have a fully-equipped computer lab for every student, having your own laptop is recommended for home practice."
            />
            <FAQItem
              question="Are the certificates valid for Government jobs?"
              answer="Yes! Our certifications are recognized and valuable for both private and government job applications."
            />
            <FAQItem
              question="Is there any placement assistance?"
              answer="Absolutely. We help our advanced students with portfolio building, interview prep, and connecting with local tech firms."
            />
          </div>
        </div>
      </section>

      <section id="enroll" className="px-8 py-24 bg-orange-50">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-[3rem] shadow-2xl shadow-orange-200/40 overflow-hidden grid md:grid-cols-5">
            {/* Left Sidebar Info */}
            <div className="md:col-span-2 bg-slate-900 p-10 text-white flex flex-col justify-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-32 h-32 bg-orange-500/20 blur-3xl rounded-full -translate-x-1/2 -translate-y-1/2"></div>
              <h2 className="text-3xl font-black mb-4 relative z-10">
                Quick <span className="text-orange-500">Enrollment</span>
              </h2>
              <p className="text-slate-400 mb-8 text-sm leading-relaxed">
                Enter the course you're interested in and any specific questions
                you have. Our team will prepare a customized roadmap for you.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm font-medium">
                  <FiCheckCircle className="text-orange-500" /> Verified
                  Certifications
                </div>
                <div className="flex items-center gap-3 text-sm font-medium">
                  <FiCheckCircle className="text-orange-500" /> 1-on-1
                  Mentorship
                </div>
                <div className="flex items-center gap-3 text-sm font-medium">
                  <FiCheckCircle className="text-orange-500" /> Lab Access 24/7
                </div>
              </div>
            </div>

            {/* Form Side */}
            <form
              onSubmit={handleSubmit}
              className="md:col-span-3 p-10 space-y-6 bg-white"
            >
              <div className="grid sm:grid-cols-2 gap-6">
                <InputGroup icon={<FiUser />} label="Your Name">
                  <input
                    required
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                    placeholder="e.g. Rahul Kumar"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </InputGroup>

                <InputGroup icon={<FiPhone />} label="Phone Number">
                  <input
                    required
                    type="tel"
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </InputGroup>
              </div>

              <InputGroup icon={<FiBook />} label="Course Name">
                <input
                  required
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                  placeholder="e.g. Python Full Stack"
                  value={formData.course}
                  onChange={(e) =>
                    setFormData({ ...formData, course: e.target.value })
                  }
                />
              </InputGroup>

              <InputGroup icon={<FiMapPin />} label="Your Address">
                <input
                  required
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                  placeholder="Ghazipur, Uttar Pradesh"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                />
              </InputGroup>

              <InputGroup icon={<FiEdit3 />} label="Description / Message">
                <textarea
                  rows="3"
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                  placeholder="Tell us about your background or what you want to learn..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </InputGroup>

              <button
                type="submit"
                disabled={status.type === "loading"}
                className="w-full py-4 bg-orange-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-orange-600 active:scale-[0.98] transition-all shadow-lg shadow-orange-200 disabled:opacity-50"
              >
                {status.type === "loading" ? (
                  "Processing..."
                ) : (
                  <>
                    Submit Request <FiSend />
                  </>
                )}
              </button>

              {status.message && (
                <div
                  className={`p-4 rounded-xl text-center text-xs font-bold ${status.type === "error" ? "bg-red-50 text-red-500" : "bg-green-50 text-green-600"}`}
                >
                  {status.message}
                </div>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="bg-slate-50 border-t border-slate-200 py-16 px-8">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center font-bold text-white">
                <FiMonitor />
              </div>
              <span className="font-black text-xl tracking-tight">
                DIVYA INSTITUTE
              </span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed max-w-sm">
              Empowering the next generation of digital creators and
              professionals with quality education since 2000.
            </p>
          </div>
          <div className="space-y-4">
            <h5 className="font-bold text-slate-800 uppercase text-xs tracking-widest">
              Connect
            </h5>
            <p className="text-slate-500 text-sm">
              Mardah Bazaar, Ghazipur, UP
            </p>
            <p className="text-slate-500 text-sm">+91 9792257501</p>
          </div>
          <div className="space-y-4">
            <h5 className="font-bold text-slate-800 uppercase text-xs tracking-widest">
              Links
            </h5>
            <p className="text-slate-500 text-sm hover:text-orange-500 cursor-pointer transition-colors">
              Privacy Policy
            </p>
            <p className="text-slate-500 text-sm hover:text-orange-500 cursor-pointer transition-colors">
              Terms of Service
            </p>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-12 pt-8 border-t border-slate-200 text-center text-slate-400 text-xs font-medium">
          © 2026 Divya Computer Institute. Educate. Empower. Elevate.
        </div>
      </footer>
    </div>
  );
}

function CourseCard({ icon, title, desc, color }) {
  return (
    <div className="p-8 rounded-[2rem] border border-slate-100 bg-white shadow-xl shadow-slate-100/50 hover:shadow-orange-100 hover:-translate-y-2 transition-all group text-left">
      <div
        className={`w-14 h-14 ${color} rounded-2xl shadow-lg flex items-center justify-center text-2xl text-white mb-6 group-hover:rotate-12 transition-transform`}
      >
        {icon}
      </div>
      <h3 className="text-xl font-black mb-3 text-slate-800">{title}</h3>
      <p className="text-slate-500 leading-relaxed text-sm mb-6">{desc}</p>
      <div className="flex items-center gap-2 text-orange-500 font-bold text-sm cursor-pointer">
        <a href="#enroll" className="hover:text-white-500 transition-colors">
          Learn More <FiArrowRight />
        </a>
      </div>
    </div>
  );
}

function StatItem({ count, label }) {
  return (
    <div className="flex flex-col gap-1">
      <h4 className="text-3xl font-black text-slate-800">{count}</h4>
      <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
        {label}
      </p>
    </div>
  );
}

function Point({ icon, text }) {
  return (
    <div className="flex items-center gap-4 text-slate-200">
      <span className="text-xl">{icon}</span>
      <p className="font-medium">{text}</p>
    </div>
  );
}
function InputGroup({ icon, label, children }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] uppercase tracking-widest font-black text-slate-400 flex items-center gap-2">
        {icon} {label}
      </label>
      {children}
    </div>
  );
}

function FAQItem({ question, answer }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:border-orange-200 transition-colors">
      <h4 className="font-bold text-slate-800 mb-2 flex justify-between items-center">
        {question}
      </h4>
      <p className="text-slate-500 text-sm leading-relaxed">{answer}</p>
    </div>
  );
}
