
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Users, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline">
                    Unlock Your Potential with SkillSync
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Swap skills with talented people from around the world. Teach what
                    you know, learn what you don't.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg" className="px-8">
                    <Link href="/browse">
                      Browse Skills <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline">
                    <Link href="/login">
                      Get Started
                    </Link>
                  </Button>
                </div>
              </div>
              <Image
                src="/bgg.jpg"
                width="600"
                height="400"
                alt="SkillSync - People collaborating and learning together"
                data-ai-hint="people collaborating learning"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
                priority
              />
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-card/50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm text-primary">
                  Key Features
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
                  Why You'll Love SkillSync
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  We've built a platform that makes skill-sharing easy, fun, and effective.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="grid gap-1 text-center">
                <div className="flex justify-center items-center mb-4">
                    <div className="bg-primary/20 text-primary p-4 rounded-full">
                        <Users className="h-8 w-8" />
                    </div>
                </div>
                <h3 className="text-xl font-bold font-headline">Community-Powered</h3>
                <p className="text-muted-foreground">
                  Connect with a global community of learners and teachers.
                </p>
              </div>
              <div className="grid gap-1 text-center">
                <div className="flex justify-center items-center mb-4">
                     <div className="bg-primary/20 text-primary p-4 rounded-full">
                        <BookOpen className="h-8 w-8" />
                    </div>
                </div>
                <h3 className="text-xl font-bold font-headline">Diverse Skills</h3>
                <p className="text-muted-foreground">
                  From coding to cooking, find an expert in any field you can imagine.
                </p>
              </div>
              <div className="grid gap-1 text-center">
                <div className="flex justify-center items-center mb-4">
                    <div className="bg-primary/20 text-primary p-4 rounded-full">
                        <Zap className="h-8 w-8" />
                    </div>
                </div>
                <h3 className="text-xl font-bold font-headline">Instant Swaps</h3>
                <p className="text-muted-foreground">
                  Our platform makes it simple to propose, accept, and manage skill swaps.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
