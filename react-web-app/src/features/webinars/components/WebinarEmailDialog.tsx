import { useState } from 'react';
import { useAuth } from '@/app/providers';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Send, Mail } from 'lucide-react';

interface WebinarEmailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  webinarId: string;
  webinarTitle: string;
}

export const WebinarEmailDialog = ({
  open,
  onOpenChange,
  webinarId,
  webinarTitle,
}: WebinarEmailDialogProps) => {
  const { user, profile } = useAuth();
  const displayName = profile?.full_name || user?.email || 'The Training Team';
  
  const [formData, setFormData] = useState({
    email_type: 'invitation',
    subject: `You're invited: ${webinarTitle}`,
    body: `Dear Colleague,\n\nYou are invited to attend an upcoming webinar: "${webinarTitle}".\n\nThis session will provide valuable insights and learning opportunities. Don't miss out!\n\nClick the link below to register and save your spot.\n\nBest regards,\n${displayName}`,
    target_audience: 'all',
  });

  const handleSave = () => {
    // Mock email campaign save - in real app, this would save to database
    // For demo, we'll just show a success message
    toast.success('Email campaign saved as draft. Note: This is a demo. Email sending is not implemented.');
    onOpenChange(false);
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const emailTemplates = {
    invitation: {
      subject: `You're invited: ${webinarTitle}`,
      body: `Dear Colleague,\n\nYou are invited to attend an upcoming webinar: "${webinarTitle}".\n\nThis session will provide valuable insights and learning opportunities. Don't miss out!\n\nClick the link below to register and save your spot.\n\nBest regards,\n${displayName}`,
    },
    reminder: {
      subject: `Reminder: ${webinarTitle} is coming up!`,
      body: `Dear Colleague,\n\nThis is a friendly reminder that "${webinarTitle}" is happening soon!\n\nMake sure you've registered and marked your calendar. We look forward to seeing you there.\n\nBest regards,\n${displayName}`,
    },
    lastCall: {
      subject: `Last chance to register: ${webinarTitle}`,
      body: `Dear Colleague,\n\nThis is your last chance to register for "${webinarTitle}"!\n\nSpots are filling up fast. Register now before it's too late.\n\nBest regards,\n${displayName}`,
    },
    followUp: {
      subject: `Thank you for attending: ${webinarTitle}`,
      body: `Dear Colleague,\n\nThank you for attending "${webinarTitle}"!\n\nWe hope you found the session valuable. The recording is now available if you'd like to review the content.\n\nPlease take a moment to provide your feedback.\n\nBest regards,\n${displayName}`,
    },
  };

  const applyTemplate = (type: string) => {
    const template = emailTemplates[type as keyof typeof emailTemplates];
    if (template) {
      setFormData((prev) => ({
        ...prev,
        email_type: type,
        subject: template.subject,
        body: template.body,
      }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Create Email Campaign
          </DialogTitle>
          <DialogDescription>
            Compose an email to promote this webinar to employees
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Email Type</Label>
              <Select
                value={formData.email_type}
                onValueChange={(v) => applyTemplate(v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="invitation">Invitation</SelectItem>
                  <SelectItem value="reminder">Reminder</SelectItem>
                  <SelectItem value="lastCall">Last Call</SelectItem>
                  <SelectItem value="followUp">Follow Up</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Target Audience</Label>
              <Select
                value={formData.target_audience}
                onValueChange={(v) => handleChange('target_audience', v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Employees</SelectItem>
                  <SelectItem value="registered">Registered Attendees</SelectItem>
                  <SelectItem value="not_registered">Not Yet Registered</SelectItem>
                  <SelectItem value="admin">Administrators</SelectItem>
                  <SelectItem value="educator">Educators</SelectItem>
                  <SelectItem value="learner">Learners</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Subject Line</Label>
            <Input
              id="subject"
              value={formData.subject}
              onChange={(e) => handleChange('subject', e.target.value)}
              placeholder="Email subject"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="body">Email Body</Label>
            <Textarea
              id="body"
              value={formData.body}
              onChange={(e) => handleChange('body', e.target.value)}
              rows={10}
              placeholder="Write your email content..."
            />
          </div>

          <div className="bg-muted/50 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>Note:</strong> To enable email sending, you need to configure the Resend API integration. 
              Currently, this will save the email as a draft for manual sending.
            </p>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!formData.subject || !formData.body}
            >
              <Send className="mr-2 h-4 w-4" />
              Save Campaign
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
