"use client"
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { Trash } from "lucide-react";
import { toast } from "react-hot-toast";
import { useAuth } from '@/hooks/useAuth';
import { validateOptions, validateTitle } from '@/lib/validators';
import { NewPollData } from '@/types/poll';
import axiosInstance from '@/lib/api.service';

const INITIAL_POLL_STATE: NewPollData = {
  title: '',
  options: ['', ''] 
};

const MIN_OPTIONS = 2;
const MAX_OPTIONS = 10;

const CreatePoll = () => {
  const [pollData, setPollData] = useState<NewPollData>(INITIAL_POLL_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {Username} = useAuth();

  const handleTitleChange = (title: string) => {
    setPollData(prev => ({ ...prev, title }));
  };

  const handleOptionChange = (index: number, value: string) => {
    setPollData(prev => ({
      ...prev,
      options: prev.options.map((opt, i) => i === index ? value : opt)
    }));
  };

  const handleOptionDelete = (index: number) => {
    if (pollData.options.length <= MIN_OPTIONS) {
      toast.error(`Minimum ${MIN_OPTIONS} options required`);
      return;
    }
    setPollData(prev => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index)
    }));
  };

  const handleAddOption = () => {
    if (pollData.options.length >= MAX_OPTIONS) {
      toast.error(`Maximum ${MAX_OPTIONS} options allowed`);
      return;
    }

    if (!validateOptions(pollData.options)) {
      toast.error("Please fill all existing options first");
      return;
    }

    setPollData(prev => ({
      ...prev,
      options: [...prev.options, '']
    }));
  };

  const handleCreatePoll = async () => {
    if (!validateTitle(pollData.title)) {
      toast.error("Question must be between 3 and 200 characters");
      return;
    }
    if (!validateOptions(pollData.options)) {
      toast.error("All options must be unique and non-empty");
      return;
    }

    setIsSubmitting(true);
    try {
      const RequestConfig = {
        username : Username,
        title : pollData.title,
        options : pollData.options.map(opt=>opt.trim())
      }
      const {data : response} = await axiosInstance.post(`/polls/new`, RequestConfig);
      toast.success(response);
      setPollData(INITIAL_POLL_STATE); 
    } catch (error : any) {
      toast.error(error.data?.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isOptionAdditionDisabled = !validateOptions(pollData.options) || 
                                 pollData.options.length >= MAX_OPTIONS;

  return (
    <section className="max-w-2xl mx-auto py-12 px-4">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Create New Poll</h1>
        <p className="text-muted-foreground">
          Create a poll to gather opinions, make decisions, or spark conversations!
        </p>
      </header>

      <form onSubmit={(e) => { e.preventDefault(); handleCreatePoll(); }}
            className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title" className="font-medium block">
            Question
          </Label>
          <Input
            id="title"
            value={pollData.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="What's your favorite programming language?"
            maxLength={200}
            required
          />
        </div>

        <fieldset className="space-y-3">
          <Label className="font-medium block">Options</Label>
          {pollData.options.map((option, index) => (
            <div key={index} className="flex items-center gap-3">
              <span className="w-6 text-right">{index + 1}.</span>
              <Input
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                placeholder={`Option ${index + 1}`}
                required
              />
              {pollData.options.length > MIN_OPTIONS && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleOptionDelete(index)}
                  aria-label="Delete option"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </fieldset>

        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
          <Button
            type="button"
            variant="secondary"
            onClick={handleAddOption}
            disabled={isOptionAdditionDisabled}
          >
            Add Option
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || !validateTitle(pollData.title) || !validateOptions(pollData.options)}
          >
            {isSubmitting ? 'Creating...' : 'Create Poll'}
          </Button>
        </div>
      </form>
    </section>
  );
};

export default CreatePoll;