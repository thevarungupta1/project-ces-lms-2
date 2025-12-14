import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Mail, User, Building2, Briefcase, Send } from 'lucide-react';

const UserInviteForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    department: '',
    position: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      toast({
        title: 'Invitation sent successfully',
        description: `An invitation email has been sent to ${formData.email}`,
      });
      setIsLoading(false);
      navigate('/users');
    }, 1500);
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/users')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Invite New User</h1>
          <p className="text-muted-foreground mt-1">Send an invitation to join the learning platform</p>
        </div>
      </div>

      {/* Form Card */}
      <div className="max-w-3xl">
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              User Information
            </CardTitle>
            <CardDescription>
              Fill in the details below to invite a new user to the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    Full Name *
                  </Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john.doe@company.com"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    An invitation link will be sent to this email address
                  </p>
                </div>
              </div>

              {/* Role and Department */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="role" className="text-sm font-medium">
                    User Role *
                  </Label>
                  <Select value={formData.role} onValueChange={(value) => handleChange('role', value)} required>
                    <SelectTrigger id="role">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-primary" />
                          <span>Admin</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="educator">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-secondary" />
                          <span>Educator</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="learner">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-accent" />
                          <span>Learner</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department" className="text-sm font-medium flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    Department
                  </Label>
                  <Input
                    id="department"
                    placeholder="Engineering, HR, Sales..."
                    value={formData.department}
                    onChange={(e) => handleChange('department', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="position" className="text-sm font-medium flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  Position/Job Title
                </Label>
                <Input
                  id="position"
                  placeholder="Senior Developer, HR Manager..."
                  value={formData.position}
                  onChange={(e) => handleChange('position', e.target.value)}
                />
              </div>

              {/* Custom Message */}
              <div className="space-y-2">
                <Label htmlFor="message" className="text-sm font-medium">
                  Custom Message (Optional)
                </Label>
                <Textarea
                  id="message"
                  placeholder="Add a personalized message to the invitation email..."
                  value={formData.message}
                  onChange={(e) => handleChange('message', e.target.value)}
                  rows={4}
                  className="resize-none"
                />
              </div>

              {/* Role Permissions Info */}
              <div className="rounded-lg border border-border bg-muted/50 p-4 space-y-2">
                <h4 className="text-sm font-semibold text-foreground">Role Permissions</h4>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p><strong>Admin:</strong> Full system access, user management, course & quiz creation</p>
                  <p><strong>Educator:</strong> Create and manage courses, quizzes, view student progress</p>
                  <p><strong>Learner:</strong> Access courses, take quizzes, view personal progress</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/users')}
                  className="flex-1"
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={isLoading || !formData.name || !formData.email || !formData.role}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Sending...
                    </div>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send Invitation
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserInviteForm;
