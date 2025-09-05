import React, { useState, useEffect, useRef } from "react";
import { View, ScrollView, Image } from "react-native";
import { SafeAreaProvider, SafeAreaView as SafeArea } from 'react-native-safe-area-context';
import Ionicons from "react-native-vector-icons/Ionicons";
import MessageBubble from "./MessageBubble";
import Header from "./components/Header";
import JobFlowBar from "./components/JobFlowBar";
import ConfirmationModal from "./components/ConfirmationModal";
import InputBar from "./components/InputBar";
import UploadScreen from "./screens/UploadScreen";
import MapScreen from "./screens/MapScreen";
import SummaryScreen from "./screens/SummaryScreen";
import PricingScreen from "./screens/PricingScreen";
import LaunchingScreen from "./screens/LaunchingScreen";
import WorkersScreen from "./screens/WorkersScreen";
import { COLORS, SIZES, SPACING } from "./theme";
import { ICONS, TEXTS } from "./config";
import { Message } from "./types";
import { useUploadStore } from "./store/uploadStore";
import { useJobFlowStore } from "./store/jobFlowStore";

const ChatScreen: React.FC = () => {
  const [inputText, setInputText] = useState<string>("");
  const [wipeoutVisible, setWipeoutVisible] = useState<boolean>(false);
  const [showProceedMessage, setShowProceedMessage] = useState<boolean>(false);
  const [showLocationSelection, setShowLocationSelection] = useState<boolean>(false);
  const [mapScreenVisible, setMapScreenVisible] = useState<boolean>(false);
  const [summaryScreenVisible, setSummaryScreenVisible] = useState<boolean>(false);
  const [pricingScreenVisible, setPricingScreenVisible] = useState<boolean>(false);
  const [launchingScreenVisible, setLaunchingScreenVisible] = useState<boolean>(false);
  const [workersScreenVisible, setWorkersScreenVisible] = useState<boolean>(false);
  
  const { setActiveStep } = useJobFlowStore();
  const scrollViewRef = useRef<ScrollView>(null);
  
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Hi Fahad, please let me know how may I help you?", type: "received" },
    { id: 2, text: "I am looking for an electrician for some work!", type: "sent" },
    {
      id: 3,
      text: "Thank you for letting me know. Can you please describe the work which particular work you want to get from electrician so that I can find your best match around you.",
      type: "received",
    },
    { id: 4, text: "I want to get the few bulb installation in my office", type: "sent" },
    {
      id: 5,
      text: "I see, can you let me know do you have accessories available with you like bulbs, holders etc and wires?",
      type: "received",
      quickReplies: ["Yes", "No"],
    },
    { id: 6, text: "Yes", type: "sent" },
    {
      id: 7,
      text: "Thanks, can you please upload the pictures of the bulb and your office where you want to get it install?",
      type: "received",
      imagePicker: true,
    },
  ]);

  const { showUploadScreen, selectedImages, currentScreen, setLocation } = useUploadStore();

  useEffect(() => {
    if (currentScreen === 'chat' && selectedImages.length > 0 && !showProceedMessage) {
      const timer = setTimeout(() => {
        setShowProceedMessage(true);
        setMessages(prev => [...prev, {
          id: prev.length + 1,
          text: "Thanks for uploading the images, do you want to ask or include anything else or should I proceed further?",
          type: "received",
          quickReplies: ["Proceed Further"],
        }]);
      }, 500);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [currentScreen, selectedImages.length, showProceedMessage]);

  useEffect(() => {
    const timer = setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
    return () => clearTimeout(timer);
  }, [messages]);

  useEffect(() => {
    setActiveStep('asking');
  }, [setActiveStep]);

  const handleImagePick = async (): Promise<void> => {
    showUploadScreen();
  };

  const handleQuickReply = (reply: string): void => {
    if (reply.toLowerCase() === "choose location") {
      setActiveStep('location');
      setMapScreenVisible(true);
      return;
    }

    if (reply.toLowerCase() === "yes proceed") {
      setSummaryScreenVisible(true);
      return;
    }

    setMessages(prev => [...prev, {
      id: prev.length + 1,
      text: reply,
      type: "sent",
    }]);

    if (reply.toLowerCase() === "proceed further") {
      setShowLocationSelection(true);
      
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: prev.length + 1,
          text: "Please select the location where you want to get this service on",
          type: "received",
          quickReplies: ["Choose Location"],
        }]);
      }, 1000);
    }
  };

  const handleSendMessage = (): void => {
    if (inputText.trim()) {
      setMessages(prev => [...prev, {
        id: prev.length + 1,
        text: inputText,
        type: "sent",
      }]);

      if (inputText.toLowerCase().includes("proceed further")) {
        setShowLocationSelection(true);
        
        setTimeout(() => {
          setMessages(prev => [...prev, {
            id: prev.length + 1,
            text: "Please select the location where you want to get this service on",
            type: "received",
            quickReplies: ["Choose Location"],
          }]);
        }, 1000);
      }

      setInputText("");
    }
  };

  const handleWipeoutConfirm = (): void => {
    console.log("Starting new order...");
    setWipeoutVisible(false);
  };

  const handleMapClose = (): void => {
    setMapScreenVisible(false);
  };

  const handleSummaryClose = (): void => {
    setSummaryScreenVisible(false);
  };

  const handleSummaryComplete = (): void => {
    setSummaryScreenVisible(false);
    setPricingScreenVisible(true);
    
    setMessages(prev => [...prev, {
      id: prev.length + 1,
      text: "Job summary completed! Ready to set budget.",
      type: "sent",
    }]);
  };

  const handlePricingOpen = (): void => {
    setActiveStep('pricing');
    setPricingScreenVisible(true);
  };

  const handlePricingClose = (): void => {
    setPricingScreenVisible(false);
  };

  const handlePriceSelect = (price: string): void => {
    setPricingScreenVisible(false);
    setWorkersScreenVisible(true);

    setMessages(prev => [...prev, {
      id: prev.length + 1,
      text: `Budget set: RS ${price}`,
      type: "sent",
    }]);

    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: prev.length + 1,
        text: "Great! Your budget has been set. Finding workers for your job!",
        type: "received",
      }]);
    }, 1000);
  };

  const handleLaunchingClose = (): void => {
    setLaunchingScreenVisible(false);
  };

  const handleWorkersClose = (): void => {
    setWorkersScreenVisible(false);
  };

  const handleLocationSelect = (location: { latitude: number; longitude: number; address: string }): void => {
    setLocation(location.address);
    
    setMessages(prev => [...prev, {
      id: prev.length + 1,
      text: `${location.address}`,
      type: "sent",
    }]);

    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: prev.length + 1,
        text: "Do you have anything else to discuss or should I generate the job description so that you can set your price there?",
        type: "received",
        quickReplies: ["Yes Proceed"],
      }]);
    }, 1000);
  };

  return (
    <SafeAreaProvider>
      <SafeArea style={{ flex: 1, backgroundColor: COLORS.background }}>
        <Header
          title={TEXTS.headerTitle}
          leftIcon={<Ionicons name="arrow-back" size={24} color={COLORS.textDark} />}
          rightIcon={<Image source={ICONS.wipeout} style={{ width: 24, height: 24 }} resizeMode="contain" />}
          onRightPress={() => setWipeoutVisible(true)}
        />

        <JobFlowBar
          onAttachmentPress={handleImagePick}
          onPricingPress={handlePricingOpen}
          onLocationPress={() => {}}
          onAskingPress={() => {}}
          onDonePress={() => {}}
        />

        <ScrollView 
          ref={scrollViewRef}
          contentContainerStyle={{ padding: 15 }}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              msg={msg}
              onImagePick={handleImagePick}
              onQuickReply={handleQuickReply}
            />
          ))}
        </ScrollView>

        <InputBar
          placeholder={TEXTS.typePlaceholder}
          value={inputText}
          onChangeText={setInputText}
          onSend={handleSendMessage}
        />

        <ConfirmationModal
          visible={wipeoutVisible}
          onClose={() => setWipeoutVisible(false)}
          message={TEXTS.wipeoutConfirmation}
          confirmText={TEXTS.yes}
          cancelText={TEXTS.no}
          onConfirm={handleWipeoutConfirm}
        />

        <UploadScreen />

        <MapScreen 
          visible={mapScreenVisible}
          onClose={handleMapClose}
          onLocationSelect={handleLocationSelect}
        />

        <SummaryScreen 
          visible={summaryScreenVisible}
          onClose={handleSummaryClose}
          onComplete={handleSummaryComplete}
        />

        <PricingScreen 
          visible={pricingScreenVisible}
          onClose={handlePricingClose}
          onPriceSelect={handlePriceSelect}
        />

        <LaunchingScreen 
          visible={launchingScreenVisible}
          onClose={handleLaunchingClose}
        />

        <WorkersScreen 
          visible={workersScreenVisible}
          onClose={handleWorkersClose}
        />
      </SafeArea>
    </SafeAreaProvider>
  );
};

export default ChatScreen;
