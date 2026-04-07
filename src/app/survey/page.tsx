"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Send, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { Question, Answer } from "@/types/survey";

export default function SurveyPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [textAnswer, setTextAnswer] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const startTimeRef = useRef<number>(Date.now());
  const totalStartTimeRef = useRef<number>(Date.now());

  const fetchQuestions = useCallback(async () => {
    try {
      const res = await fetch("/api/questions");
      if (!res.ok) throw new Error("Không thể tải danh sách câu hỏi.");
      const data = await res.json();
      setQuestions(data);
    } catch (error) {
      console.error("Failed to fetch questions:", error);
      setError("Có lỗi xảy ra khi tải dữ liệu khảo sát. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  useEffect(() => {
    startTimeRef.current = Date.now();
  }, [currentStep]);

  const handleSubmit = async (finalAnswers: Answer[]) => {
    if (isSubmitting) return; // Prevent double submission
    
    setIsSubmitting(true);
    const totalTimeSpend = Math.round((Date.now() - totalStartTimeRef.current) / 1000);

    try {
      const response = await fetch("/api/surveys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers: finalAnswers,
          totalTimeSpend,
        }),
      });

      if (response.ok) {
        setIsDone(true);
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Có lỗi xảy ra khi gửi đánh giá. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error(error);
      alert("Lỗi kết nối. Vui lòng kiểm tra mạng.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = (answerValue: string) => {
    const endTime = Date.now();
    const timeSpentMs = endTime - startTimeRef.current;
    
    const newAnswer: Answer = {
      questionId: questions[currentStep].id,
      answer: answerValue,
      timeSpentMs,
      startTime: startTimeRef.current,
      endTime,
    };

    const updatedAnswers = [...answers];
    const existingIndex = updatedAnswers.findIndex(a => a.questionId === newAnswer.questionId);
    
    if (existingIndex > -1) {
      updatedAnswers[existingIndex] = newAnswer;
    } else {
      updatedAnswers.push(newAnswer);
    }
    
    setAnswers(updatedAnswers);

    if (currentStep < questions.length - 1) {
      // Small delay for smooth transition
      setTimeout(() => {
        setCurrentStep(prev => prev + 1);
        const nextAnswer = updatedAnswers.find(a => a.questionId === questions[currentStep + 1]?.id);
        setTextAnswer(nextAnswer ? nextAnswer.answer : "");
      }, 200);
    } else {
      handleSubmit(updatedAnswers);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      const prevAnswer = answers.find(a => a.questionId === questions[currentStep - 1].id);
      setTextAnswer(prevAnswer ? prevAnswer.answer : "");
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="animate-spin text-cyan w-12 h-12" />
      </div>
    );
  }

  if (error || questions.length === 0) {
    return (
      <div className="text-center py-20 glass-card rounded-3xl p-10 max-w-md mx-auto">
        <AlertCircle className="w-16 h-16 text-silver/20 mx-auto mb-4" />
        <h2 className="text-2xl font-display font-bold text-silver/80">
          {error ? "Lỗi hệ thống" : "Chưa có khảo sát"}
        </h2>
        <p className="text-silver/40 px-4 mt-2">
          {error || "Ban tổ chức hiện chưa thiết lập nội dung khảo sát. Vui lòng quay lại sau."}
        </p>
        <button 
          onClick={() => error ? fetchQuestions() : router.push("/")}
          className="mt-8 px-8 py-3 bg-white/5 border border-white/10 rounded-xl text-xs uppercase font-bold hover:bg-white/10"
        >
          {error ? "Thử lại" : "Trang chủ"}
        </button>
      </div>
    );
  }

  if (isDone) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-10 rounded-3xl text-center max-w-md mx-auto"
      >
        <div className="flex justify-center mb-6">
          <CheckCircle2 className="w-20 h-20 text-cyan animate-pulse" />
        </div>
        <h1 className="text-3xl font-display font-bold text-gradient mb-4 uppercase tracking-tighter">
          Cảm ơn bạn!
        </h1>
        <p className="text-silver/80 leading-relaxed mb-8">
          Những đóng góp của bạn là món quà vô giá giúp chúng tôi hoàn thiện hơn trong các sự kiện sắp tới.
        </p>
        <button 
          onClick={() => router.push("/")}
          className="w-full py-4 bg-gradient-primary rounded-xl font-bold uppercase tracking-widest hover:glow-magenta transition-all"
        >
          Trở về trang chủ
        </button>
      </motion.div>
    );
  }

  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;

  return (
    <div className="w-full max-w-2xl px-4">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-white/5 z-50">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          className="h-full bg-gradient-to-r from-magenta via-royal-light to-cyan"
        />
      </div>

      <div className="mb-8 flex items-center justify-between">
        <button 
          onClick={handlePrev}
          disabled={currentStep === 0}
          className={`flex items-center gap-2 text-sm uppercase tracking-widest transition-all ${currentStep === 0 ? "opacity-0 invisible" : "text-silver/60 hover:text-cyan"}`}
        >
          <ChevronLeft size={18} /> Quay lại
        </button>
        <span className="text-xs font-mono text-silver/40 tracking-[0.2em]">
          PROGRESS: {currentStep + 1} / {questions.length}
        </span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -20, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="glass-card p-8 md:p-12 rounded-[2.5rem] relative overflow-hidden neon-border-cyan group"
        >
          {/* Internal Scanline Effect */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="scanline"></div>
          </div>

          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan/30 to-transparent" />
          
          <h2 className="text-2xl md:text-3xl font-display font-black leading-tight mb-8 tracking-tight">
            <span className="text-silver/20 mr-4 font-mono">{currentStep + 1}.</span>
            {currentQuestion.text}
          </h2>

          <div className="space-y-4 relative z-10">
            {currentQuestion.type === "choice" ? (
              currentQuestion.options?.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleNext(option)}
                  className="w-full text-left p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan/50 hover:bg-cyan/10 hover:translate-x-2 transition-all group/btn flex items-center justify-between"
                >
                  <span className="text-silver/90 group-hover/btn:text-cyan group-hover/btn:font-bold transition-all">{option}</span>
                  <div className="w-6 h-6 rounded-full border border-white/20 group-hover/btn:border-cyan group-hover/btn:bg-cyan/20 flex items-center justify-center transition-all">
                    <div className="w-2.5 h-2.5 rounded-full bg-cyan opacity-0 group-hover/btn:opacity-100 transition-opacity glow-cyan" />
                  </div>
                </button>
              ))
            ) : (
              <div className="space-y-6">
                <textarea
                  value={textAnswer}
                  onChange={(e) => setTextAnswer(e.target.value)}
                  placeholder={currentQuestion.placeholder}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 min-h-[150px] focus:outline-none focus:border-magenta/50 focus:bg-magenta/5 transition-all text-silver resize-none"
                />
                <button
                  onClick={() => handleNext(textAnswer.trim())}
                  disabled={isSubmitting || !textAnswer.trim()}
                  className="w-full py-5 bg-gradient-primary rounded-2xl font-bold uppercase tracking-widest flex items-center justify-center gap-3 hover:glow-magenta transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <Loader2 size={24} className="animate-spin" />
                  ) : (
                    <>
                      {currentStep === questions.length - 1 ? "Hoàn tất & Gửi" : "Tiếp theo"}
                      <Send size={18} />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
      
      <div className="mt-12 text-center opacity-20 hover:opacity-100 transition-opacity">
        <p className="text-[10px] font-mono tracking-[0.3em] uppercase">
          Neon Heritage Protocol // Active Terminal
        </p>
      </div>
    </div>
  );
}
