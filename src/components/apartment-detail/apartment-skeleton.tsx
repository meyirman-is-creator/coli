"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function ApartmentSkeleton() {
  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8">
      {/* Navigation */}
      <div className="flex justify-between items-center mb-6">
        <Skeleton className="h-10 w-24" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
      
      {/* Gallery Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4 mb-8">
        <Skeleton className="h-[450px] w-full rounded-lg" />
        
        <div className="hidden lg:grid grid-cols-2 grid-rows-2 gap-4">
          <Skeleton className="h-[218px] w-full rounded-lg" />
          <Skeleton className="h-[218px] w-full rounded-lg" />
          <Skeleton className="h-[218px] w-full rounded-lg" />
          <Skeleton className="h-[218px] w-full rounded-lg" />
        </div>
      </div>
      
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
        {/* Left Column - Information */}
        <div>
          <Skeleton className="h-12 w-3/4 mb-3" />
          <Skeleton className="h-5 w-full max-w-lg mb-6" />
          
          <div className="flex flex-wrap gap-3 mb-8">
            <Skeleton className="h-8 w-24 rounded-full" />
            <Skeleton className="h-8 w-24 rounded-full" />
            <Skeleton className="h-8 w-24 rounded-full" />
            <Skeleton className="h-8 w-24 rounded-full" />
          </div>
          
          <div className="mb-8">
            <div className="border-b border-border pb-0 mb-6 flex gap-4">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
            </div>
            
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        </div>
        
        {/* Right Column - Contact & Apply */}
        <div>
          {/* Price Card */}
          <Card className="bg-card rounded-xl p-6 mb-6 shadow-sm border border-border">
            <div className="flex justify-between items-center mb-4">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-8 w-24" />
            </div>
            
            <Separator className="my-4" />
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>
              
              <div className="flex justify-between">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>
              
              <div className="flex justify-between">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
            
            <div className="mt-6 flex flex-col gap-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </Card>
          
          {/* Contact Skeleton */}
          <Card className="bg-card rounded-xl p-6 mb-6 shadow-sm border border-border">
            <Skeleton className="h-6 w-48 mb-4" />
            
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div>
                  <Skeleton className="h-5 w-32 mb-1" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
              
              <div className="flex gap-2">
                <Skeleton className="h-9 w-9 rounded-md" />
                <Skeleton className="h-9 w-9 rounded-md" />
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <Skeleton className="h-6 w-32 mb-3" />
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-8 w-20" />
              </div>
              
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-8 w-20" />
              </div>
            </div>
          </Card>
          
          {/* Interest Groups Skeleton */}
          <Card className="bg-card rounded-xl p-6 shadow-sm border border-border">
            <Skeleton className="h-6 w-48 mb-4" />
            
            <div className="space-y-4">
              <Card className="border border-border bg-background">
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <Skeleton className="h-5 w-32 mb-1" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    
                    <div className="flex">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <Skeleton className="h-8 w-8 rounded-full -ml-2" />
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border-t border-border">
                  <div className="flex justify-between w-full">
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-8 w-32" />
                  </div>
                </div>
              </Card>
              
              <Skeleton className="h-10 w-full" />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}