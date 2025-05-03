// TestWithAppStructure.js
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function TestWithAppStructure() {
    const [activeTab, setActiveTab] = useState("mindmapping");

    return (
        <div className="container mx-auto py-6 px-4">
            <Card className="shadow-lg">
                <CardHeader className="bg-primary text-primary-foreground">
                    <CardTitle className="text-xl font-bold">MindMap Generator</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <Tabs
                        defaultValue="mindmapping"
                        value={activeTab}
                        onValueChange={setActiveTab}
                        className="w-full"
                    >
                        <TabsList className="grid w-full grid-cols-2 mb-6">
                            <TabsTrigger value="mindmapping">Mindmapping</TabsTrigger>
                            <TabsTrigger value="settings">Settings</TabsTrigger>
                        </TabsList>

                        <TabsContent value="mindmapping" className="mt-0">
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Card className="shadow-md">
                                        <CardHeader>
                                            <CardTitle>Prompt</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <Textarea
                                                className="min-h-32"
                                                placeholder="Enter your mindmap prompt here..."
                                            />
                                        </CardContent>
                                    </Card>

                                    <Card className="shadow-md">
                                        <CardHeader>
                                            <CardTitle>Output</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <Textarea
                                                className="min-h-32"
                                                placeholder="Mermaid code output will appear here..."
                                            />
                                        </CardContent>
                                    </Card>
                                </div>

                                <Button
                                    className="w-full md:w-auto flex items-center justify-center"
                                    size="lg"
                                >
                                    Generate Mindmap
                                </Button>
                            </div>
                        </TabsContent>

                        <TabsContent value="settings" className="mt-0">
                            <Card className="shadow-md">
                                <CardHeader>
                                    <CardTitle>API Settings</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="token">OpenAI API Key</Label>
                                        <Input
                                            type="password"
                                            id="token"
                                            placeholder="Enter your OpenAI API key"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="model">Model</Label>
                                        <Select>
                                            <SelectTrigger id="model">
                                                <SelectValue placeholder="Select model" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="gpt-4o-mini">gpt-4o-mini</SelectItem>
                                                <SelectItem value="gpt-4o">gpt-4o</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
}