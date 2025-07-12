

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail, Phone, MapPin } from "lucide-react";
import Image from "next/image";

export default function AboutPage() {
  const teamMembers = [
    {
      name: "Jay Rathod",
      role: "Founder & CEO",
      avatarUrl: null,
      bio: "Jay is passionate about creating communities and empowering individuals through skill sharing.",
    },
    {
      name: "Govind Suthar",
      role: "Lead Developer",
      avatarUrl: null,
      bio: "Govind is the mastermind behind the SkillSync platform, turning ideas into reality with code.",
    },
    {
      name: "Pratham Malhotra",
      role: "Full Stack Developer",
      avatarUrl: null,
      bio: "Pratham ensures our platform is robust, scalable, and delivers an amazing user experience.",
    },
    {
      name: "Jatin Chandani",
      role: "Community Manager",
      avatarUrl: null,
      bio: "Jatin ensures our community is vibrant, supportive, and a great place to learn.",
    },
  ];

  return (
    <div className="space-y-16">
      {/* Our Mission Section */}
      <section className="text-center">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline">
          Our Mission
        </h1>
        <p className="max-w-[700px] mx-auto text-muted-foreground md:text-xl mt-4">
          We believe everyone has a skill to share and a passion to learn. SkillSync was born from the idea that knowledge should be accessible, and the best way to learn is by connecting with others. Our mission is to build a global community where people can exchange skills, foster talent, and grow together.
        </p>
      </section>

      {/* Meet the Team Section */}
      <section>
        <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">
                Meet the Team
            </h2>
            <p className="max-w-[700px] mx-auto text-muted-foreground md:text-lg mt-2">
                The passionate individuals dedicated to making skill-swapping a reality.
            </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member) => (
            <Card key={member.name} className="text-center bg-card/60 backdrop-blur-sm border-white/20 shadow-lg">
              <CardContent className="pt-6">
                <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-white/50">
                  <AvatarImage src={member.avatarUrl || undefined} alt={member.name} data-ai-hint="person portrait" />
                  <AvatarFallback className="text-2xl font-bold bg-primary/20 text-primary">
                    {member.name.split(' ').map(n => n.charAt(0)).join('')}
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-headline font-semibold">{member.name}</h3>
                <p className="text-primary font-medium">{member.role}</p>
                <p className="text-muted-foreground mt-2 text-sm">{member.bio}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Contact Us Section */}
      <section>
        <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">
                Get In Touch
            </h2>
            <p className="max-w-[700px] mx-auto text-muted-foreground md:text-lg mt-2">
                Have questions or feedback? We'd love to hear from you.
            </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6">
                <div className="flex items-start gap-4">
                    <div className="bg-primary/20 text-primary p-3 rounded-full">
                        <MapPin className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="font-headline font-semibold text-lg">Our Office</h3>
                        <p className="text-muted-foreground">123 Skill Street, Knowledge City, Ahmedabad, Gujarat 380001</p>
                    </div>
                </div>
                 <div className="flex items-start gap-4">
                    <div className="bg-primary/20 text-primary p-3 rounded-full">
                        <Mail className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="font-headline font-semibold text-lg">Email Us</h3>
                        <p className="text-muted-foreground">contact@skillsync.io</p>
                    </div>
                </div>
                 <div className="flex items-start gap-4">
                    <div className="bg-primary/20 text-primary p-3 rounded-full">
                        <Phone className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="font-headline font-semibold text-lg">Call Us</h3>
                        <p className="text-muted-foreground">(+91) 98765 43210</p>
                    </div>
                </div>
            </div>
            <Card className="bg-card/60 backdrop-blur-sm border-white/20 shadow-lg p-2">
                <CardHeader>
                    <CardTitle>Send us a message</CardTitle>
                </CardHeader>
                <CardContent>
                    <form className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" placeholder="Your Name" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" placeholder="your.email@example.com" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="message">Message</Label>
                            <Textarea id="message" placeholder="How can we help you?" className="min-h-[120px]" />
                        </div>
                        <Button type="submit" className="w-full">Submit</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
      </section>
    </div>
  );
}
