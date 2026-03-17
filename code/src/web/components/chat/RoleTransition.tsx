/**
 * RoleTransition - 角色切换动画组件 (Cinematic Version)
 *
 * 使用 Framer Motion 实现的电影级角色切换效果
 * 强调情感的流动和视角的转换
 */

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { RoleTransitionProps } from "../../types";
import { ROLE_CONFIGS } from "../../hooks/useRoleState";

// 更加富有诗意和情感的文案配置
const TRANSITION_COPY = {
  "roleplay-mom": {
    title: "正在接入：妈妈的内心世界",
    subtitle: "让我们试着去感受，那些她未曾说出口的关爱与担忧...",
    icon: "👩",
    particleColor: "bg-pink-300",
  },
  "roleplay-dad": {
    title: "正在接入：爸爸的深沉视角",
    subtitle: "在他的沉默背后，或许藏着如山般厚重的责任与期许...",
    icon: "👨",
    particleColor: "bg-blue-300",
  },
  soulhug: {
    title: "回归心灵树洞",
    subtitle: "回到这片宁静之地，做回那个被温柔接纳的自己...",
    icon: "🌳",
    particleColor: "bg-emerald-300",
  },
};

export function RoleTransition({
  to,
  onComplete,
}: RoleTransitionProps) {
  const [showContent, setShowContent] = useState(false);
  const config = ROLE_CONFIGS[to];
  const copy = TRANSITION_COPY[to] || TRANSITION_COPY["soulhug"];

  // 使用 ref 保存最新的 onComplete，避免 effect 重复触发
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  // 动画时序控制 - 只在组件挂载时启动一次
  useEffect(() => {
    console.log("[RoleTransition] Animation started, target:", to);

    // 0.3s 后显示内容
    const contentTimer = setTimeout(() => {
      console.log("[RoleTransition] Showing content");
      setShowContent(true);
    }, 300);

    // 3.5s 后结束整个动画 (给用户足够时间阅读文案)
    const endTimer = setTimeout(() => {
      console.log("[RoleTransition] Calling onComplete");
      onCompleteRef.current?.();
    }, 3500);

    return () => {
      console.log("[RoleTransition] Cleanup timers");
      clearTimeout(contentTimer);
      clearTimeout(endTimer);
    };
  }, [to]); // 只依赖 to，不依赖 onComplete

  // 背景渐变配置
  const bgVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.8 } },
    exit: { opacity: 0, transition: { duration: 0.5 } },
  };

  // 居中内容动画
  const contentVariants = {
    hidden: { scale: 0.8, opacity: 0, y: 20 },
    visible: {
      scale: 1,
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 20,
        delay: 0.1,
      },
    },
    exit: { scale: 1.1, opacity: 0, transition: { duration: 0.4 } },
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {/* 1. 动态背景层 */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br ${config.color} backdrop-blur-md`}
          variants={bgVariants}
        />

        {/* 2. 装饰性光晕 - 呼吸效果 */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="w-[600px] h-[600px] rounded-full bg-white/20 blur-3xl" />
        </motion.div>

        {/* 3. 核心内容区 */}
        {showContent && (
          <motion.div
            className="relative z-10 flex flex-col items-center text-center px-6 max-w-lg"
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* 头像/图标容器 */}
            <motion.div
              className="relative mb-8"
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                className="w-32 h-32 rounded-full bg-white/30 backdrop-blur-xl border-4 border-white/60 flex items-center justify-center shadow-2xl relative z-10"
                initial={{ rotate: -180, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{
                  type: "spring" as const,
                  stiffness: 120,
                  damping: 15,
                  delay: 0.2,
                }}
              >
                <span className="text-6xl filter drop-shadow-md">
                  {config.avatar}
                </span>
              </motion.div>
              
              {/* 环绕粒子轨道效果 */}
              <motion.div 
                className="absolute inset-0 -m-4 border-2 border-white/20 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              >
                <div className={`w-3 h-3 rounded-full ${copy.particleColor} absolute -top-1.5 left-1/2 -translate-x-1/2 shadow-lg`} />
              </motion.div>
              <motion.div 
                className="absolute inset-0 -m-8 border border-white/10 rounded-full"
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              >
                <div className="w-2 h-2 rounded-full bg-white/60 absolute -bottom-1 left-1/2 -translate-x-1/2 shadow-lg" />
              </motion.div>
            </motion.div>

            {/* 文字内容 */}
            <motion.h2
              className="text-3xl font-bold text-slate-800 mb-4 tracking-wide"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              {copy.title}
            </motion.h2>

            <motion.div
              className="w-16 h-1 bg-white/50 rounded-full mb-6 mx-auto"
              initial={{ width: 0 }}
              animate={{ width: 64 }}
              transition={{ delay: 0.6, duration: 0.4 }}
            />

            <motion.p
              className="text-lg text-slate-700 font-medium leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              {copy.subtitle}
            </motion.p>
          </motion.div>
        )}

        {/* 4. 浮动粒子背景 */}
        <Particles color={copy.particleColor} count={12} />
      </motion.div>
    </AnimatePresence>
  );
}

// 简单的粒子组件
function Particles({ color, count }: { color: string; count: number }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(count)].map((_, i) => (
        <motion.div
          key={i}
          className={`absolute w-2 h-2 rounded-full ${color} opacity-40`}
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight + 100,
            scale: 0,
          }}
          animate={{
            y: [null, Math.random() * -100 - 100], // 向上浮动
            x: [null, (Math.random() - 0.5) * 50], // 左右轻微摆动
            opacity: [0, 0.6, 0],
            scale: [0, 1.5, 0],
          }}
          transition={{
            duration: 2 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

/**
 * 简化版角色切换提示
 */
export function RoleTransitionBanner({
  to,
  parentType,
  onDismiss,
}: {
  to: "roleplay-mom" | "roleplay-dad";
  parentType?: string;
  onDismiss?: () => void;
}) {
  const config = ROLE_CONFIGS[to];
  const displayName = parentType || config.name;

  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss?.();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <motion.div 
      className="fixed top-20 left-1/2 -translate-x-1/2 z-40"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -50, opacity: 0 }}
    >
      <div
        className={`flex items-center gap-3 px-5 py-3 rounded-full shadow-lg border
                    ${
                      to === "roleplay-mom"
                        ? "bg-gradient-to-r from-pink-50 to-rose-50 border-pink-200"
                        : "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200"
                    }`}
      >
        <span className="text-2xl">{config.avatar}</span>
        <span
          className={`font-medium ${
            to === "roleplay-mom" ? "text-pink-700" : "text-blue-700"
          }`}
        >
          🎭 进入{displayName}视角
        </span>
      </div>
    </motion.div>
  );
}
