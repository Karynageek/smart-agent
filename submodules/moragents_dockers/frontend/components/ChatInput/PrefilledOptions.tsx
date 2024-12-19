import React, { useState, useEffect } from "react";
import { Box } from "@chakra-ui/react";
import {
  Sparkles,
  FileText,
  DollarSign,
  Send,
  Search,
  Newspaper,
  Trophy,
  LineChart,
  Flame,
  Globe2,
  Zap,
  ArrowLeftRight,
  Gift,
} from "lucide-react";
import styles from "./PrefilledOptions.module.css";

type PrefilledOption = {
  title: string;
  icon: React.ReactNode;
  examples: Array<{
    text: string;
    agent: string;
  }>;
};

type PrefilledOptionsProps = {
  onSelect: (message: string) => void;
  isWidgetOpen?: boolean;
};

const prefilledOptionsMap: Record<string, PrefilledOption> = {
  default: {
    title: "Default Agent 🔄",
    icon: <Globe2 size={20} />,
    examples: [
      { text: "Who is Elon Musk?", agent: "default" },
      { text: "What Morpheus agents are currently active?", agent: "default" },
    ],
  },
  imagen: {
    title: "Generate Images 🎨",
    icon: <Sparkles size={20} />,
    examples: [
      { text: "Generate an image of Donald Trump", agent: "imagen" },
      {
        text: "Create a cyberpunk style portrait of Elon Musk",
        agent: "imagen",
      },
    ],
  },
  rag: {
    title: "Document Analysis 📄",
    icon: <FileText size={20} />,
    examples: [
      { text: "Summarize the uploaded document", agent: "rag" },
      {
        text: "What are the key points in this uploaded document?",
        agent: "rag",
      },
    ],
  },
  "crypto data": {
    title: "Crypto Market Data 📊",
    icon: <LineChart size={20} />,
    examples: [
      { text: "What's the current price of ETH?", agent: "crypto" },
      { text: "Show me BTC's market cap", agent: "crypto" },
      { text: "What's the FDV of USDC?", agent: "crypto" },
    ],
  },
  "token swap": {
    title: "Token Swaps 💱",
    icon: <ArrowLeftRight size={20} />,
    examples: [
      { text: "Swap ETH for USDC", agent: "swap" },
      { text: "Exchange my BTC for ETH", agent: "swap" },
    ],
  },
  "tweet sizzler": {
    title: "Tweet Generator 🔥",
    icon: <Flame size={20} />,
    examples: [
      { text: "Write a viral tweet about Web3", agent: "tweet" },
      {
        text: "Create a spicy crypto market tweet about Gary Gensler",
        agent: "tweet",
      },
    ],
  },
  dca: {
    title: "DCA Strategy Planning 💰",
    icon: <DollarSign size={20} />,
    examples: [
      { text: "Set up a weekly DCA plan for ETH", agent: "dca" },
      { text: "Help me create a monthly BTC buying strategy", agent: "dca" },
    ],
  },
  base: {
    title: "Base Transactions 🔄",
    icon: <Send size={20} />,
    examples: [
      { text: "Send USDC on Base", agent: "base" },
      { text: "Swap USDC for ETH on Base", agent: "base" },
    ],
  },
  "mor claims": {
    title: "MOR Claims 🎁",
    icon: <Gift size={20} />,
    examples: [
      { text: "Claim my MOR rewards", agent: "claims" },
      { text: "Help me claim my pending MOR tokens", agent: "claims" },
    ],
  },
  "mor rewards": {
    title: "MOR Rewards Tracking 🏆",
    icon: <Trophy size={20} />,
    examples: [
      { text: "Show my MOR rewards balance", agent: "rewards" },
      { text: "Calculate my pending MOR rewards", agent: "rewards" },
    ],
  },
  "realtime search": {
    title: "Real-Time Search 🔍",
    icon: <Search size={20} />,
    examples: [
      {
        text: "Search the web for latest news about Ethereum",
        agent: "realtime",
      },
      { text: "What did Donald Trump say about Bitcoin?", agent: "realtime" },
    ],
  },
  "crypto news": {
    title: "Crypto News Analysis 📰",
    icon: <Newspaper size={20} />,
    examples: [
      { text: "Analyze recent crypto market news", agent: "news" },
      { text: "What's the latest news impact on BTC?", agent: "news" },
    ],
  },
};

const PrefilledOptions: React.FC<PrefilledOptionsProps> = ({
  onSelect,
  isWidgetOpen = false,
}) => {
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
  const containerStyle = {
    paddingLeft: isWidgetOpen ? "5%" : "20%",
    paddingRight: isWidgetOpen ? "35%" : "20%",
  };

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await fetch("http://localhost:8080/agents/available");
        const data = await response.json();
        setSelectedAgents(data.selected_agents);
      } catch (error) {
        console.error("Failed to fetch agents:", error);
      }
    };

    fetchAgents();
  }, []);

  return (
    <div className={styles.prefilledContainer} style={containerStyle}>
      <div className={styles.prefilledInner}>
        {selectedAgents.map((agentName) => {
          const option = prefilledOptionsMap[agentName];
          if (!option) return null;

          return (
            <div key={agentName} className={styles.prefilledSection}>
              <div className={styles.sectionTitle}>
                <Box className={styles.sectionIcon}>{option.icon}</Box>
                {option.title}
              </div>
              <div className={styles.examplesList}>
                {option.examples.map((example, exampleIndex) => (
                  <button
                    key={exampleIndex}
                    className={styles.exampleButton}
                    onClick={() => onSelect(example.text)}
                  >
                    {example.text}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PrefilledOptions;