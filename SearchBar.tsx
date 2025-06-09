import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  X,
  Calendar,
  User,
  MessageSquare,
  Image,
  Video,
  FileText,
  Mic,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onClose?: () => void;
  onFiltersChange?: (filters: SearchFilters) => void;
}

interface SearchFilters {
  messageType: "all" | "text" | "image" | "video" | "file" | "audio";
  dateRange: "all" | "today" | "week" | "month";
  sender: "all" | "me" | "them";
}

const messageTypeOptions = [
  { value: "all", label: "All Messages", icon: MessageSquare },
  { value: "text", label: "Text", icon: MessageSquare },
  { value: "image", label: "Images", icon: Image },
  { value: "video", label: "Videos", icon: Video },
  { value: "file", label: "Files", icon: FileText },
  { value: "audio", label: "Audio", icon: Mic },
];

const dateRangeOptions = [
  { value: "all", label: "All Time" },
  { value: "today", label: "Today" },
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
];

const senderOptions = [
  { value: "all", label: "Everyone" },
  { value: "me", label: "Me" },
  { value: "them", label: "Them" },
];

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search messages...",
  onClose,
  onFiltersChange,
}: SearchBarProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    messageType: "all",
    dateRange: "all",
    sender: "all",
  });
  const [showFilters, setShowFilters] = useState(false);

  const updateFilter = <K extends keyof SearchFilters>(
    key: K,
    value: SearchFilters[K],
  ) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  const clearAllFilters = () => {
    const defaultFilters: SearchFilters = {
      messageType: "all",
      dateRange: "all",
      sender: "all",
    };
    setFilters(defaultFilters);
    onFiltersChange?.(defaultFilters);
  };

  const getActiveFiltersCount = () => {
    return Object.values(filters).filter((value) => value !== "all").length;
  };

  const getFilterLabel = (type: keyof SearchFilters, value: string) => {
    switch (type) {
      case "messageType":
        return (
          messageTypeOptions.find((option) => option.value === value)?.label ||
          value
        );
      case "dateRange":
        return (
          dateRangeOptions.find((option) => option.value === value)?.label ||
          value
        );
      case "sender":
        return (
          senderOptions.find((option) => option.value === value)?.label || value
        );
      default:
        return value;
    }
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-gray-800/50 backdrop-blur-xl border border-gray-600 rounded-lg p-4 space-y-4"
    >
      {/* Main Search Bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
          />
          {value && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onChange("")}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white p-1"
            >
              <X size={16} />
            </Button>
          )}
        </div>

        {/* Filter Toggle */}
        <Button
          size="sm"
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            "text-gray-300 border-gray-600 hover:bg-gray-700",
            activeFiltersCount > 0 && "border-blue-500 text-blue-400",
          )}
        >
          <Filter size={16} className="mr-2" />
          Filters
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-2 bg-blue-500 text-white">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>

        {onClose && (
          <Button
            size="sm"
            variant="ghost"
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X size={18} />
          </Button>
        )}
      </div>

      {/* Advanced Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-white">
                Advanced Filters
              </span>
              {activeFiltersCount > 0 && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={clearAllFilters}
                  className="text-blue-400 hover:text-blue-300 text-xs"
                >
                  Clear All
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Message Type Filter */}
              <div>
                <label className="text-xs text-gray-400 mb-1 block">
                  Message Type
                </label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between text-gray-300 border-gray-600 hover:bg-gray-700"
                    >
                      <div className="flex items-center gap-2">
                        {(() => {
                          const option = messageTypeOptions.find(
                            (opt) => opt.value === filters.messageType,
                          );
                          const IconComponent = option?.icon || MessageSquare;
                          return (
                            <>
                              <IconComponent size={14} />
                              {option?.label}
                            </>
                          );
                        })()}
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-gray-800 border-gray-700">
                    {messageTypeOptions.map((option) => {
                      const IconComponent = option.icon;
                      return (
                        <DropdownMenuItem
                          key={option.value}
                          onClick={() =>
                            updateFilter("messageType", option.value as any)
                          }
                          className="text-gray-300 focus:bg-gray-700 focus:text-white"
                        >
                          <IconComponent size={14} className="mr-2" />
                          {option.label}
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Date Range Filter */}
              <div>
                <label className="text-xs text-gray-400 mb-1 block">
                  Date Range
                </label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between text-gray-300 border-gray-600 hover:bg-gray-700"
                    >
                      <div className="flex items-center gap-2">
                        <Calendar size={14} />
                        {getFilterLabel("dateRange", filters.dateRange)}
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-gray-800 border-gray-700">
                    {dateRangeOptions.map((option) => (
                      <DropdownMenuItem
                        key={option.value}
                        onClick={() =>
                          updateFilter("dateRange", option.value as any)
                        }
                        className="text-gray-300 focus:bg-gray-700 focus:text-white"
                      >
                        <Calendar size={14} className="mr-2" />
                        {option.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Sender Filter */}
              <div>
                <label className="text-xs text-gray-400 mb-1 block">
                  Sender
                </label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between text-gray-300 border-gray-600 hover:bg-gray-700"
                    >
                      <div className="flex items-center gap-2">
                        <User size={14} />
                        {getFilterLabel("sender", filters.sender)}
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-gray-800 border-gray-700">
                    {senderOptions.map((option) => (
                      <DropdownMenuItem
                        key={option.value}
                        onClick={() =>
                          updateFilter("sender", option.value as any)
                        }
                        className="text-gray-300 focus:bg-gray-700 focus:text-white"
                      >
                        <User size={14} className="mr-2" />
                        {option.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Active Filters Display */}
            {activeFiltersCount > 0 && (
              <div className="space-y-2">
                <span className="text-xs text-gray-400">Active Filters:</span>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(filters).map(([key, value]) => {
                    if (value === "all") return null;
                    return (
                      <Badge
                        key={key}
                        variant="secondary"
                        className="bg-blue-500/20 text-blue-300 border border-blue-500/30"
                      >
                        {getFilterLabel(key as keyof SearchFilters, value)}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            updateFilter(key as keyof SearchFilters, "all")
                          }
                          className="ml-1 p-0 h-auto text-blue-300 hover:text-white"
                        >
                          <X size={12} />
                        </Button>
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
