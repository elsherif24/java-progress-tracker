import { ref } from "vue";

interface ToastItem {
  id: string;
  message: string;
  variant: "success" | "info" | "warning" | "celebration";
  icon?: string;
  celebration?: boolean;
  duration?: number;
}

const toasts = ref<ToastItem[]>([]);

export function useToast() {
  const addToast = (
    message: string,
    variant: "success" | "info" | "warning" | "celebration" = "success",
    options: {
      icon?: string;
      celebration?: boolean;
      duration?: number;
    } = {},
  ) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);

    const toast: ToastItem = {
      id,
      message,
      variant,
      icon: options.icon,
      celebration: options.celebration || variant === "celebration",
      duration: options.duration || 3000,
    };

    toasts.value.push(toast);

    // Auto-remove toast after duration
    if (toast.duration && toast.duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, toast.duration);
    }

    return id;
  };

  const removeToast = (id: string) => {
    const index = toasts.value.findIndex((toast) => toast.id === id);
    if (index > -1) {
      toasts.value.splice(index, 1);
    }
  };

  const clearAll = () => {
    toasts.value = [];
  };

  // Specific toast methods for different milestone types
  const showPageMilestone = (_pagesRead: number, totalPages: number) => {
    // This should only be called when ALL pages are completed
    addToast(`🎉 All ${totalPages} pages completed!`, "celebration", {
      icon: "📖",
      celebration: true,
      duration: 3000,
    });
  };

  const showProblemMilestone = (
    _problemsSolved: number,
    totalProblems: number,
  ) => {
    // This should only be called when ALL problems are completed
    addToast(`🎉 All ${totalProblems} problems solved!`, "celebration", {
      icon: "🧩",
      celebration: true,
      duration: 3000,
    });
  };

  const showMcqMilestone = () => {
    addToast(`🎯 MCQ Quiz completed!`, "celebration", {
      icon: "🎊",
      celebration: true,
      duration: 3000,
    });
  };

  const showChapterStarted = (chapterTitle: string) => {
    addToast(`🚀 Started: ${chapterTitle}`, "info", {
      icon: "📚",
      duration: 2000,
    });
  };

  // New method for page progress (every 5 pages)
  const showPageProgress = (pagesRead: number, totalPages: number) => {
    addToast(`📖 ${pagesRead}/${totalPages} pages read`, "info", {
      icon: "📄",
      celebration: false,
      duration: 1500,
    });
  };

  return {
    toasts,
    addToast,
    removeToast,
    clearAll,
    showPageMilestone,
    showProblemMilestone,
    showMcqMilestone,
    showChapterStarted,
    showPageProgress,
  };
}
