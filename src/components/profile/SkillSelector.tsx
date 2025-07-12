
'use client';

import { useState } from 'react';
import type { Skill } from '@/lib/types';
import { predefinedSkills } from '@/lib/mock-data';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Badge } from '@/components/ui/badge';
import { X, Link as LinkIcon, PlusCircle } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface SkillSelectorProps {
  value: Skill[];
  onChange: (skills: Skill[]) => void;
}

export function SkillSelector({ value = [], onChange }: SkillSelectorProps) {
  const [open, setOpen] = useState(false);
  const [customSkill, setCustomSkill] = useState('');

  const handleSelect = (skillName: string) => {
    if (skillName && !value.find(s => s.name.toLowerCase() === skillName.toLowerCase())) {
      const existingPredefined = predefinedSkills.find(ps => ps.name.toLowerCase() === skillName.toLowerCase());
      const newSkill: Skill = existingPredefined 
        ? { ...existingPredefined, referenceUrl: '' }
        : { id: uuidv4(), name: skillName, referenceUrl: '' };

      onChange([...value, newSkill]);
    }
    setOpen(false);
  };

  const handleAddCustom = () => {
    if (customSkill.trim()) {
      handleSelect(customSkill.trim());
      setCustomSkill('');
    }
  };

  const handleRemove = (skillId: string) => {
    onChange(value.filter(s => s.id !== skillId));
  };
  
  const handleUrlChange = (skillId: string, url: string) => {
    onChange(value.map(s => s.id === skillId ? { ...s, referenceUrl: url } : s));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {value.map((skill) => (
          <div key={skill.id} className="group relative">
             <Badge variant="secondary" className="pr-8 py-1 text-sm">
                {skill.name}
                {skill.referenceUrl && <LinkIcon className="h-3 w-3 ml-1.5 text-primary" />}
            </Badge>
            <button
                type="button"
                onClick={() => handleRemove(skill.id)}
                className="absolute -top-1 -right-1.5 bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
            >
                <X className="h-3 w-3" />
            </button>
             <div className="mt-2">
                <Input 
                    placeholder="Reference link (optional)" 
                    value={skill.referenceUrl || ''}
                    onChange={(e) => handleUrlChange(skill.id, e.target.value)}
                    className="h-8 text-xs"
                />
            </div>
          </div>
        ))}
      </div>
       <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button type="button" variant="outline">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add a skill
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command>
            <CommandInput 
                placeholder="Search or add custom skill..."
                value={customSkill}
                onValueChange={setCustomSkill}
            />
            <CommandList>
              <CommandEmpty>
                 <Button variant="ghost" className="w-full" onClick={handleAddCustom}>
                    Add "{customSkill}" as a new skill
                </Button>
              </CommandEmpty>
              <CommandGroup heading="Suggestions">
                {predefinedSkills
                  .filter(ps => !value.some(s => s.id === ps.id))
                  .map((skill) => (
                    <CommandItem
                      key={skill.id}
                      onSelect={() => handleSelect(skill.name)}
                    >
                      {skill.name}
                    </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
