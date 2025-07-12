
"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Star, StarHalf, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { User, Swap } from "@/lib/types";
import { addFeedback } from "@/lib/local-storage";

interface LeaveFeedbackDialogProps {
  swap: Swap;
  currentUser: User;
  otherUser: User;
  onFeedbackSubmitted: () => void;
  hasGivenFeedback: boolean;
}

const StarRatingInput = ({ rating, setRating, hoverRating, setHoverRating }: {
  rating: number;
  setRating: (r: number) => void;
  hoverRating: number;
  setHoverRating: (r: number) => void;
}) => {
  return (
    <div className="flex gap-1" onMouseLeave={() => setHoverRating(0)}>
      {[...Array(5)].map((_, i) => {
        const starValue = i + 1;
        return (
          <Star
            key={starValue}
            size={32}
            className="cursor-pointer text-yellow-400 transition-colors"
            onMouseEnter={() => setHoverRating(starValue)}
            onClick={() => setRating(starValue)}
            fill={starValue <= (hoverRating || rating) ? "currentColor" : "none"}
          />
        );
      })}
    </div>
  );
};

export function LeaveFeedbackDialog({ swap, currentUser, otherUser, onFeedbackSubmitted, hasGivenFeedback }: LeaveFeedbackDialogProps) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (rating === 0) {
      toast({ title: "Incomplete Feedback", description: "Please select a star rating.", variant: "destructive" });
      return;
    }
    setLoading(true);
    
    try {
        addFeedback({
            fromUserId: currentUser.id,
            fromUserName: currentUser.name,
            fromUserAvatar: currentUser.profilePhotoUrl,
            toUserId: otherUser.id,
            rating,
            comment,
        }, swap);
        
        toast({ title: "Feedback Submitted", description: `Thank you for leaving feedback for ${otherUser.name}.` });
        onFeedbackSubmitted();
        setOpen(false);
    } catch (error) {
        console.error(error);
        toast({ title: "Error", description: "Failed to submit feedback.", variant: "destructive" });
    } finally {
        setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" disabled={hasGivenFeedback}>
          <Star className="mr-2 h-4 w-4" />
          {hasGivenFeedback ? "Feedback Submitted" : "Leave Feedback"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-headline">Leave Feedback for {otherUser.name}</DialogTitle>
          <DialogDescription>
            Your feedback helps build a trustworthy community. Rate your experience swapping with {otherUser.name}.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Rating</Label>
            <StarRatingInput rating={rating} setRating={setRating} hoverRating={hoverRating} setHoverRating={setHoverRating} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="comment">Comment (Optional)</Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={`Share your experience...`}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button type="submit" onClick={handleSubmit} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Submit Feedback
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
