import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Type,
  Image,
  Camera,
  Smile,
  Globe,
  Users,
  UserCheck,
  Clock,
  Send,
  Palette,
  Plus,
  Minus,
  AlignCenter,
  AlignLeft,
  AlignRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    username: string;
    avatar?: string;
  };
}

type StatusType = "text" | "image" | "camera";
type PrivacyLevel = "everyone" | "contacts" | "close-friends";
type TextAlign = "left" | "center" | "right";

const backgroundGradients = [
  "from-blue-500 to-purple-500",
  "from-pink-500 to-red-500",
  "from-green-500 to-blue-500",
  "from-yellow-500 to-orange-500",
  "from-purple-500 to-pink-500",
  "from-indigo-500 to-purple-500",
  "from-teal-500 to-green-500",
  "from-orange-500 to-red-500",
];

const quickTemplates = [
  { emoji: "📚", text: "Studying hard today!" },
  { emoji: "☕", text: "Coffee break time" },
  { emoji: "🎯", text: "Goals for today" },
  { emoji: "🌟", text: "Feeling motivated" },
  { emoji: "💪", text: "Productivity mode ON" },
  { emoji: "🎉", text: "Just achieved something!" },
];

const privacyOptions = [
  {
    value: "everyone",
    label: "Everyone",
    icon: Globe,
    description: "Anyone can see your status",
  },
  {
    value: "contacts",
    label: "My Contacts",
    icon: Users,
    description: "Only people in your contacts",
  },
  {
    value: "close-friends",
    label: "Close Friends",
    icon: UserCheck,
    description: "Only your close friends",
  },
];

export default function StatusModal({
  isOpen,
  onClose,
  user,
}: StatusModalProps) {
  const [statusType, setStatusType] = useState<StatusType>("text");
  const [statusText, setStatusText] = useState("");
  const [statusEmoji, setStatusEmoji] = useState("😊");
  const [selectedBackground, setSelectedBackground] = useState(0);
  const [textSize, setTextSize] = useState([24]);
  const [textAlign, setTextAlign] = useState<TextAlign>("center");
  const [privacy, setPrivacy] = useState<PrivacyLevel>("everyone");
  const [expiryHours, setExpiryHours] = useState([24]);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
        setStatusType("image");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
        setStatusType("camera");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTemplateSelect = (template: (typeof quickTemplates)[0]) => {
    setStatusEmoji(template.emoji);
    setStatusText(template.text);
    setStatusType("text");
  };

  const handlePost = () => {
    const statusData = {
      type: statusType,
      text: statusText,
      emoji: statusEmoji,
      background:
        statusType === "text" ? backgroundGradients[selectedBackground] : null,
      image: uploadedImage,
      textSize: textSize[0],
      textAlign,
      privacy,
      expiryHours: expiryHours[0],
      timestamp: new Date(),
    };

    console.log("Posting status:", statusData);
    onClose();

    // Reset form
    setStatusText("");
    setStatusEmoji("😊");
    setUploadedImage(null);
    setStatusType("text");
    setSelectedBackground(0);
    setTextSize([24]);
    setTextAlign("center");
    setPrivacy("everyone");
    setExpiryHours([24]);
  };

  const getTextAlignClass = () => {
    switch (textAlign) {
      case "left":
        return "text-left";
      case "right":
        return "text-right";
      default:
        return "text-center";
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-gray-900 border border-gray-600 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-600">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={user.avatar} alt={user.username} />
                <AvatarFallback>
                  {user.username[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-white text-lg font-semibold">
                  Create Status
                </h2>
                <p className="text-gray-400 text-sm">{user.username}</p>
              </div>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <X size={20} />
            </Button>
          </div>

          <div className="flex">
            {/* Preview Area */}
            <div className="flex-1 p-6">
              <div className="aspect-[9/16] max-w-xs mx-auto relative overflow-hidden rounded-xl">
                {statusType === "text" ? (
                  <div
                    className={cn(
                      "w-full h-full bg-gradient-to-br flex items-center justify-center p-6",
                      backgroundGradients[selectedBackground],
                    )}
                  >
                    <div
                      className={cn(
                        "text-white font-bold leading-tight",
                        getTextAlignClass(),
                      )}
                      style={{ fontSize: `${textSize[0]}px` }}
                    >
                      {statusEmoji && (
                        <span className="block mb-2 text-4xl">
                          {statusEmoji}
                        </span>
                      )}
                      {statusText || "Add your status text..."}
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center relative">
                    {uploadedImage ? (
                      <>
                        <img
                          src={uploadedImage}
                          alt="Status"
                          className="w-full h-full object-cover"
                        />
                        {statusText && (
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center p-4">
                            <div
                              className={cn(
                                "text-white font-bold text-shadow",
                                getTextAlignClass(),
                              )}
                              style={{ fontSize: `${textSize[0]}px` }}
                            >
                              {statusEmoji && (
                                <span className="block mb-2 text-4xl">
                                  {statusEmoji}
                                </span>
                              )}
                              {statusText}
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-center">
                        <div className="text-6xl mb-4">📷</div>
                        <p className="text-gray-400">
                          Upload an image or take a photo
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Privacy Badge */}
                <div className="absolute top-3 left-3">
                  <Badge
                    variant="secondary"
                    className="bg-black/50 text-white border-none"
                  >
                    {privacyOptions.find((p) => p.value === privacy)?.label}
                  </Badge>
                </div>

                {/* Expiry Badge */}
                <div className="absolute top-3 right-3">
                  <Badge
                    variant="secondary"
                    className="bg-black/50 text-white border-none"
                  >
                    {expiryHours[0]}h
                  </Badge>
                </div>
              </div>
            </div>

            {/* Controls Area */}
            <div className="w-80 border-l border-gray-600 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="p-6 space-y-6">
                {/* Status Type Selection */}
                <div className="space-y-3">
                  <h3 className="text-white font-medium">Status Type</h3>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setStatusType("text")}
                      className={cn(
                        "p-3 rounded-lg border transition-colors",
                        statusType === "text"
                          ? "border-blue-500 bg-blue-500/10 text-blue-400"
                          : "border-gray-600 text-gray-400 hover:border-gray-500",
                      )}
                    >
                      <Type size={20} className="mx-auto mb-1" />
                      <span className="text-xs">Text</span>
                    </button>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className={cn(
                        "p-3 rounded-lg border transition-colors",
                        statusType === "image"
                          ? "border-blue-500 bg-blue-500/10 text-blue-400"
                          : "border-gray-600 text-gray-400 hover:border-gray-500",
                      )}
                    >
                      <Image size={20} className="mx-auto mb-1" />
                      <span className="text-xs">Image</span>
                    </button>
                    <button
                      onClick={() => cameraInputRef.current?.click()}
                      className={cn(
                        "p-3 rounded-lg border transition-colors",
                        statusType === "camera"
                          ? "border-blue-500 bg-blue-500/10 text-blue-400"
                          : "border-gray-600 text-gray-400 hover:border-gray-500",
                      )}
                    >
                      <Camera size={20} className="mx-auto mb-1" />
                      <span className="text-xs">Camera</span>
                    </button>
                  </div>
                </div>

                {/* Quick Templates */}
                <div className="space-y-3">
                  <h3 className="text-white font-medium">Quick Templates</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {quickTemplates.map((template, index) => (
                      <button
                        key={index}
                        onClick={() => handleTemplateSelect(template)}
                        className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-left"
                      >
                        <div className="text-lg mb-1">{template.emoji}</div>
                        <p className="text-white text-xs">{template.text}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Status Content */}
                <div className="space-y-3">
                  <h3 className="text-white font-medium">Content</h3>

                  {/* Emoji Selection */}
                  <div>
                    <label className="text-gray-400 text-sm mb-2 block">
                      Emoji
                    </label>
                    <Input
                      value={statusEmoji}
                      onChange={(e) => setStatusEmoji(e.target.value)}
                      placeholder="😊"
                      className="bg-gray-800 border-gray-600 text-white text-center text-2xl"
                      maxLength={2}
                    />
                  </div>

                  {/* Text Input */}
                  <div>
                    <label className="text-gray-400 text-sm mb-2 block">
                      Text
                    </label>
                    <Textarea
                      value={statusText}
                      onChange={(e) => setStatusText(e.target.value)}
                      placeholder="What's on your mind?"
                      className="bg-gray-800 border-gray-600 text-white resize-none"
                      rows={3}
                      maxLength={100}
                    />
                    <span className="text-xs text-gray-400 mt-1 block">
                      {statusText.length}/100
                    </span>
                  </div>
                </div>

                {/* Text Formatting (for text status) */}
                {statusType === "text" && (
                  <div className="space-y-3">
                    <h3 className="text-white font-medium">Text Formatting</h3>

                    {/* Font Size */}
                    <div>
                      <label className="text-gray-400 text-sm mb-2 block">
                        Font Size: {textSize[0]}px
                      </label>
                      <Slider
                        value={textSize}
                        onValueChange={setTextSize}
                        max={36}
                        min={16}
                        step={2}
                        className="w-full"
                      />
                    </div>

                    {/* Text Alignment */}
                    <div>
                      <label className="text-gray-400 text-sm mb-2 block">
                        Alignment
                      </label>
                      <div className="flex gap-2">
                        {[
                          { value: "left", icon: AlignLeft },
                          { value: "center", icon: AlignCenter },
                          { value: "right", icon: AlignRight },
                        ].map((align) => {
                          const IconComponent = align.icon;
                          return (
                            <button
                              key={align.value}
                              onClick={() =>
                                setTextAlign(align.value as TextAlign)
                              }
                              className={cn(
                                "p-2 rounded border transition-colors",
                                textAlign === align.value
                                  ? "border-blue-500 bg-blue-500/10 text-blue-400"
                                  : "border-gray-600 text-gray-400 hover:border-gray-500",
                              )}
                            >
                              <IconComponent size={16} />
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Background Selection */}
                    <div>
                      <label className="text-gray-400 text-sm mb-2 block">
                        Background
                      </label>
                      <div className="grid grid-cols-4 gap-2">
                        {backgroundGradients.map((gradient, index) => (
                          <button
                            key={index}
                            onClick={() => setSelectedBackground(index)}
                            className={cn(
                              "w-12 h-12 rounded-lg bg-gradient-to-br border-2 transition-all",
                              gradient,
                              selectedBackground === index
                                ? "border-white scale-110"
                                : "border-transparent hover:scale-105",
                            )}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Privacy Settings */}
                <div className="space-y-3">
                  <h3 className="text-white font-medium">Privacy</h3>
                  <div className="space-y-2">
                    {privacyOptions.map((option) => {
                      const IconComponent = option.icon;
                      return (
                        <button
                          key={option.value}
                          onClick={() =>
                            setPrivacy(option.value as PrivacyLevel)
                          }
                          className={cn(
                            "w-full flex items-center gap-3 p-3 rounded-lg border transition-colors text-left",
                            privacy === option.value
                              ? "border-blue-500 bg-blue-500/10"
                              : "border-gray-600 hover:border-gray-500",
                          )}
                        >
                          <IconComponent
                            size={18}
                            className={
                              privacy === option.value
                                ? "text-blue-400"
                                : "text-gray-400"
                            }
                          />
                          <div className="flex-1">
                            <p className="text-white text-sm font-medium">
                              {option.label}
                            </p>
                            <p className="text-gray-400 text-xs">
                              {option.description}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Expiry Time */}
                <div className="space-y-3">
                  <h3 className="text-white font-medium">Expires In</h3>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-400 text-sm">
                        {expiryHours[0]} hours
                      </span>
                      <Badge variant="secondary">
                        {expiryHours[0] <= 6
                          ? "Short"
                          : expiryHours[0] <= 24
                            ? "Medium"
                            : "Long"}
                      </Badge>
                    </div>
                    <Slider
                      value={expiryHours}
                      onValueChange={setExpiryHours}
                      max={48}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Post Button */}
                <Button
                  onClick={handlePost}
                  disabled={!statusText.trim() && !uploadedImage}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                >
                  <Send size={16} className="mr-2" />
                  Post Status
                </Button>
              </div>
            </div>
          </div>

          {/* Hidden File Inputs */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleCameraCapture}
            className="hidden"
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
