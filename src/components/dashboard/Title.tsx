import { Button } from "@/components/ui/button";
export default function Title(){
    return <div className="text-center space-y-2">
        <div className="flex justify-between items-center">
          <div></div>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              AI Content Generator
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Generate high-quality content ideas, outlines, and full drafts for
              your audience
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <a href="/editor">📝 Open Editor</a>
            </Button>
          </div>
        </div>
      </div>
}