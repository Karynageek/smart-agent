import React, { FC } from "react";
import { Grid, GridItem, Text } from "@chakra-ui/react";
import ReactMarkdown from "react-markdown";
import {
  ChatMessage,
  SwapMessagePayload,
  ClaimMessagePayload,
  ImageMessageContent,
  CryptoDataMessageContent,
  HotelFinderMessageContent,
  BaseMessageContent,
} from "@/services/types";
import { Avatar } from "@/components/Avatar";
import { availableAgents } from "@/config";
import { SwapMessage } from "@/components/SwapMessage";
import { ClaimMessage } from "@/components/ClaimMessage/ClaimMessage";
import { Tweet } from "@/components/Tweet";
import styles from "./index.module.css";

type MessageItemProps = {
  message: ChatMessage;
  selectedAgent: string;
  onCancelSwap: (fromAction: number) => void;
  onSwapSubmit: (swapTx: any) => void;
  onClaimSubmit: (claimTx: any) => void;
  isLastSwapMessage: boolean;
  isLastClaimMessage: boolean;
};

export const MessageItem: FC<MessageItemProps> = ({
  message,
  selectedAgent,
  onCancelSwap,
  onSwapSubmit,
  onClaimSubmit,
  isLastSwapMessage,
  isLastClaimMessage,
}) => {
  const agentName = availableAgents[selectedAgent]?.name || "Undefined Agent";
  const isUser = message.role === "user";
  const { content } = message;

  const renderContent = () => {
    if (typeof content === "string") {
      if (message.agentName === "tweet sizzler") {
        return <Tweet initialContent={content} selectedAgent={selectedAgent} />;
      }
      return (
        <ReactMarkdown className={styles.messageText}>{content}</ReactMarkdown>
      );
    }

    if (message.agentName === "imagen") {
      const imageContent = content as unknown as ImageMessageContent;
      return (
        <ReactMarkdown className={styles.messageText}>
          {`Successfully generated image with ${imageContent.service}`}
        </ReactMarkdown>
      );
    }

    if (message.agentName === "crypto data") {
      const cryptoDataContent = content as unknown as CryptoDataMessageContent;
      return (
        <ReactMarkdown className={styles.messageText}>
          {cryptoDataContent.data}
        </ReactMarkdown>
      );
    }

    if (message.role === "hotel_finder") {
      return (
        <HotelFinderMessage
          isActive={isLastHotelFinderMessage}
          selectedAgent={selectedAgent}
          fromMessage={content as HotelFinderMessagePayload}
          onSearchHotels={onHotelSearch}
        />
      );
    }

    if (message.agentName === "base") {
      const baseContent = content as unknown as BaseMessageContent;
      return (
        <ReactMarkdown className={styles.messageText}>
          {baseContent.message}
        </ReactMarkdown>
      );
    }

    if (message.role === "swap") {
      return (
        <SwapMessage
          isActive={isLastSwapMessage}
          onCancelSwap={onCancelSwap}
          selectedAgent={selectedAgent}
          fromMessage={content as SwapMessagePayload}
          onSubmitSwap={onSwapSubmit}
        />
      );
    }

    if (message.role === "claim") {
      return (
        <ClaimMessage
          isActive={isLastClaimMessage}
          selectedAgent={selectedAgent}
          fromMessage={content as ClaimMessagePayload}
          onSubmitClaim={onClaimSubmit}
        />
      );
    }

    return (
      <Text className={styles.messageText}>{JSON.stringify(content)}</Text>
    );
  };

  return (
    <Grid
      templateAreas={`"avatar name" "avatar message"`}
      templateColumns="0fr 3fr"
      className={styles.messageGrid}
    >
      <GridItem area="avatar">
        <Avatar isAgent={!isUser} agentName={agentName} />
      </GridItem>
      <GridItem area="name">
        <Text className={styles.nameText}>{isUser ? "Me" : agentName}</Text>
      </GridItem>
      <GridItem area="message">{renderContent()}</GridItem>
    </Grid>
  );
};
