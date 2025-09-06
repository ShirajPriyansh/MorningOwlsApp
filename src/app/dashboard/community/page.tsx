
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Users, Hash } from 'lucide-react';

const peers = [
  { name: 'Alice Johnson', role: 'Frontend Developer', avatar: 'https://picsum.photos/id/1011/200/200' },
  { name: 'Bob Williams', role: 'Backend Developer', avatar: 'https://picsum.photos/id/1012/200/200' },
  { name: 'Charlie Brown', role: 'Full-Stack Developer', avatar: 'https://picsum.photos/id/1013/200/200' },
  { name: 'Diana Miller', role: 'UI/UX Designer', avatar: 'https://picsum.photos/id/1014/200/200' },
];

const forums = [
  { name: 'JavaScript Mastery', members: 1250, description: 'Discussions about advanced JS topics.' },
  { name: 'React & Next.js', members: 2340, description: 'For all things related to React and Next.js.' },
  { name: 'AI in Development', members: 875, description: 'Integrating AI into modern applications.' },
  { name: 'Career Growth', members: 3120, description: 'Share tips on career development in tech.' },
];

export default function CommunityPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold font-headline mb-2">Community Connect</h1>
      <p className="text-muted-foreground mb-8">
        Find peers, join discussions, and grow together.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search />
                Find Your Peers
              </CardTitle>
              <CardDescription>Search for fellow learners with similar goals.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input placeholder="Search by name or skill..." />
                <Button>Search</Button>
              </div>
              <div className="mt-6 space-y-4">
                {peers.map((peer, index) => (
                  <Card key={index} className="hover:bg-muted/50">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarImage src={peer.avatar} alt={peer.name} data-ai-hint="person" />
                          <AvatarFallback>{peer.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">{peer.name}</p>
                          <p className="text-sm text-muted-foreground">{peer.role}</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Connect</Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users />
                Forum Groups
              </CardTitle>
              <CardDescription>Join groups to discuss topics and share knowledge.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {forums.map((forum, index) => (
                <Card key={index} className="hover:bg-muted/50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-primary/10 text-primary p-2 rounded-lg">
                        <Hash className="w-5 h-5" />
                      </div>
                      <p className="font-semibold">{forum.name}</p>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{forum.description}</p>
                    <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">{forum.members.toLocaleString()} members</span>
                        <Button variant="secondary" size="sm">Join</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
