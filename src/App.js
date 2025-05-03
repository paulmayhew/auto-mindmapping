import React, {useState} from "react";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label";
import {Textarea} from "@/components/ui/textarea";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Braces, ChevronRight, Settings} from "lucide-react";
import "./index.css";
import Mermaid from "./Mermaid";

function MindmappingTab({prompt, setPrompt, result, setResult, callOpenAi}) {
  return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Prompt</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                  id="prompt"
                  className="min-h-32"
                  placeholder="Enter your mindmap prompt here..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
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
                  value={result}
                  onChange={(e) => setResult(e.target.value)}
                  placeholder="Mermaid code output will appear here..."
              />
            </CardContent>
          </Card>
        </div>

        <Button
            onClick={callOpenAi}
            className="w-full md:w-auto flex items-center justify-center"
            size="lg"
        >
          Generate Mindmap <ChevronRight className="ml-2 h-4 w-4"/>
        </Button>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Mindmap Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-white rounded-md dark:bg-slate-900">
              <Mermaid key={result ? result.length : 0} chart={result}/>
            </div>
          </CardContent>
        </Card>
      </div>
  );
}

function SettingsTab({
                       token,
                       setToken,
                       model,
                       setModel,
                       promptTemplate,
                       setPromptTemplate,
                       maxTokens,
                       setMaxTokens,
                       temperature,
                       setTemperature,
                     }) {
  const [localTemperature, setLocalTemperature] = useState(String(temperature));

  const handlePromptTemplateChange = (e) => {
    setPromptTemplate(e.target.value);
    localStorage.setItem("promptTemplate", e.target.value);
  };

  function extractIntFromString(str) {
    const result = str.match(/\d+/);
    if (result) {
      return parseInt(result[0], 10);
    } else {
      return 0;
    }
  }

  function extractFloatFromString(str) {
    str = str.replace(",", "."); // Replace comma with period as a decimal separator
    const result = str.match(/^-?(\d+)?(\.\d*)?/); // Match optional digits before and after the decimal point
    if (result) {
      return result[0] === "" ? 0 : parseFloat(result[0]); // Return '0' if the input is an empty string
    } else {
      return 0;
    }
  }

  const handleMaxTokensChange = (e) => {
    let maxTokens = extractIntFromString(e.target.value);
    setMaxTokens(maxTokens);
    localStorage.setItem("maxTokens", maxTokens);
  };

  const handleTemperatureChange = (e) => {
    const input = e.target.value;
    setLocalTemperature(input); // Always update the local input field

    const parsedTemperature = extractFloatFromString(input);
    if (!isNaN(parsedTemperature) && input !== "") {
      setTemperature(parsedTemperature);
      localStorage.setItem("temperature", parsedTemperature);
    }
  };

  const handleTemperatureBlur = () => {
    // When user leaves the input field, revert to the last valid number if necessary
    const parsedTemperature = parseFloat(localTemperature);
    if (isNaN(parsedTemperature)) {
      setLocalTemperature(String(temperature));
    } else {
      setLocalTemperature(String(parsedTemperature));
      setTemperature(parsedTemperature);
      localStorage.setItem("temperature", parsedTemperature);
    }
  };

  return (
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="mr-2 h-5 w-5"/> API Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="token">OpenAI API Key</Label>
            <Input
                type="password"
                id="token"
                name="token"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Enter your OpenAI API key"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="model">Model</Label>
            <Select value={model} onValueChange={setModel}>
              <SelectTrigger id="model">
                <SelectValue placeholder="Select model"/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gpt-4o-mini">gpt-4o-mini</SelectItem>
                <SelectItem value="gpt-4o">gpt-4o</SelectItem>
                <SelectItem value="gpt-4-turbo">gpt-4-turbo</SelectItem>
                <SelectItem value="gpt-4">gpt-4</SelectItem>
                <SelectItem value="gpt-3.5-turbo">gpt-3.5-turbo</SelectItem>
                <SelectItem value="gpt-4o-2024-08-06">gpt-4o-2024-08-06</SelectItem>
                <SelectItem value="gpt-3.5-turbo-16k">gpt-3.5-turbo-16k</SelectItem>
                <SelectItem value="chatgpt-4o-latest">chatgpt-4o-latest</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="maxTokens">Max Tokens</Label>
              <Input
                  type="text"
                  id="maxTokens"
                  name="maxTokens"
                  value={maxTokens}
                  onChange={handleMaxTokensChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="temperature">Temperature</Label>
              <Input
                  type="text"
                  id="temperature"
                  name="temperature"
                  value={localTemperature}
                  onChange={handleTemperatureChange}
                  onBlur={handleTemperatureBlur}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="promptTemplate" className="flex items-center">
              <Braces className="mr-2 h-4 w-4"/> Prompt Template
            </Label>
            <Textarea
                id="promptTemplate"
                className="min-h-40"
                value={promptTemplate}
                onChange={handlePromptTemplateChange}
            />
          </div>
        </CardContent>
      </Card>
  );
}

export default function App() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [activeTab, setActiveTab] = useState("mindmapping");
  const [token, setToken] = useState("");
  const [model, setModel] = useState("gpt-4o-mini");

  const [maxTokens, setMaxTokens] = useState(
      localStorage.getItem("maxTokens") || 2000
  );

  const [temperature, setTemperature] = useState(
      localStorage.getItem("temperature") || 0.7
  );

  const [promptTemplate, setPromptTemplate] = useState(
      localStorage.getItem("promptTemplate") ||
      `Create a mermaid mindmap based on user input like these examples:
brainstorming mindmap
mindmap
\t\troot(("leisure activities weekend"))
\t\t\t\t["spend time with friends"]
\t\t\t\t::icon(fafa fa-users)
\t\t\t\t\t\t("action activities")
\t\t\t\t\t\t::icon(fafa fa-play)
\t\t\t\t\t\t\t\t("dancing at night club")
\t\t\t\t\t\t\t\t("going to a restaurant")
\t\t\t\t\t\t\t\t("go to the theater")
\t\t\t\t["spend time your self"]
\t\t\t\t::icon(fa fa-fa-user)
\t\t\t\t\t\t("meditation")
\t\t\t\t\t\t::icon(fa fa-om)
\t\t\t\t\t\t("\`take a sunbath ☀️\`")
\t\t\t\t\t\t("reading a book")
\t\t\t\t\t\t::icon(fa fa-book)
text summary mindmap:
Barack Obama (born August 4, 1961) is an American politician who served as the 44th president of the United States from 2009 to 2017. A member of the Democratic Party, he was the first African-American president of the United States.
mindmap
\troot("Barack Obama")
\t\t("Born August 4, 1961")
\t\t::icon(fa fa-baby-carriage)
\t\t("American Politician")
\t\t\t::icon(fa fa-flag)
\t\t\t\t("44th President of the United States")
\t\t\t\t\t("2009 - 2017")
\t\t("Democratic Party")
\t\t\t::icon(fa fa-democrat)
\t\t("First African-American President")
cause and effects mindmap:
mindmap
\troot("Landlord sells apartment")
\t\t::icon(fa fa-sell)
\t\t("Renter must be notified of sale")
\t\t::icon(fa fa-envelope)
\t\t\t("Tenants may feel some uncertainty")
\t\t\t::icon(fa fa-question-circle)
\t\t("Notice periods must be observed")
\t\t::icon(fa fa-calendar)
\t\t\t("Landlord can submit notice of termination for personal use")
\t\t\t::icon(fa fa-home)
\t\t\t\t("Tenant has to look for a new apartment")
\t\t\t\t::icon(fa fa-search)
\t\t("New owner")
\t\t::icon(fa fa-user)
\t\t\t\t("New owner takes over existing rental agreement")
\t\t\t\t::icon(fa fa-file-contract)
\t\t\t\t\t\t("Tenant keeps previous apartment")
\t\t\t\t\t\t::icon(fa fa-handshake)
\t\t\t\t("New owner terminates newly concluded lease")
\t\t\t\t::icon(fa fa-ban)
\t\t\t\t\t\t("Tenant has to look for a new apartment")
\t\t\t\t\t\t::icon(fa fa-search)
Only one root, use free FontAwesome icons, and follow node types "[", "(". No need to use "mermaid", "\`\`\`", or "graph TD". Respond only with code and syntax.`
  );

  // gpt-3.5-turbo
  async function callOpenAi() {
    setResult("");

    let url = "https://api.openai.com/v1/chat/completions";
    let data = {
      model: model,
      messages: [
        {
          role: "system",
          content: promptTemplate,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      stream: true,
      max_tokens: maxTokens,
      temperature: Number(temperature),
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      console.error("Error:", response.statusText);
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let text = "";

    let resultString = ""; // Define resultString here to collect all results

    while (true) {
      const {done, value} = await reader.read();
      if (done) {
        break;
      }

      text += decoder.decode(value, {stream: true});
      const lines = text.split("\n");
      text = lines.pop();

      for (const line of lines) {
        const message = line.replace(/^data: /, "").trim();

        if (message === "") {
          continue;
        }

        if (message === "[DONE]") {
          return;
        }

        try {
          const parsed = JSON.parse(message);
          let result = parsed.choices[0].delta.content || "";

          // Append each line to the resultString
          if (
              result !== "```" &&
              result !== "```mermaid" &&
              !result.includes("mermaid")
          ) {
            resultString += result;
          }

          // If the result contains a newline, update the result state
          if (
              result.includes("\n") &&
              result !== "```" &&
              result !== "```mermaid" &&
              !result.includes("mermaid")
          ) {
            setResult(resultString);
          }
        } catch (error) {
          console.error("Could not JSON parse stream message", {
            message,
            error,
          });
        }
      }
    }

    // Set the final state after the loop ends if it hasn't been set yet
    if (
        !resultString.includes("\n") &&
        result !== "```" &&
        result !== "```mermaid" &&
        !result.includes("mermaid")
    ) {
      setResult(resultString);
    }
  }

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
                <MindmappingTab
                    prompt={prompt}
                    setPrompt={setPrompt}
                    result={result}
                    setResult={setResult}
                    callOpenAi={callOpenAi}
                    model={model}
                    promptTemplate={promptTemplate}
                />
              </TabsContent>

              <TabsContent value="settings" className="mt-0">
                <SettingsTab
                    token={token}
                    setToken={setToken}
                    model={model}
                    setModel={setModel}
                    promptTemplate={promptTemplate}
                    setPromptTemplate={setPromptTemplate}
                    maxTokens={maxTokens}
                    setMaxTokens={setMaxTokens}
                    temperature={temperature}
                    setTemperature={setTemperature}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
  );
}