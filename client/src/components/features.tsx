import { 
  AlignLeft, 
  Function, 
  FileText, 
  Code, 
  RefreshCw, 
  CheckCircle 
} from "lucide-react";

const features = [
  {
    name: "Naming conventions (10 points)",
    description: "Evaluation of variable, function, and class naming for clarity and consistency with language conventions.",
    icon: AlignLeft,
  },
  {
    name: "Function length and modularity (20 points)",
    description: "Assessment of function size, complexity, and appropriate separation of concerns.",
    icon: Function,
  },
  {
    name: "Comments and documentation (20 points)",
    description: "Review of code documentation quality, presence of docstrings, and meaningful comments.",
    icon: FileText,
  },
  {
    name: "Formatting/indentation (15 points)",
    description: "Evaluation of code style consistency, indentation, and adherence to style guides.",
    icon: Code,
  },
  {
    name: "Reusability and DRY (15 points)",
    description: "Analysis of code duplication and potential for reuse across the codebase.",
    icon: RefreshCw,
  },
  {
    name: "Best practices in web dev (20 points)",
    description: "Evaluation against industry standard practices in web development and language-specific conventions.",
    icon: CheckCircle,
  },
];

export default function Features() {
  return (
    <div id="features" className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-purple-500 font-semibold tracking-wide uppercase">Features</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Comprehensive code analysis
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Get detailed insights into your code quality across 6 critical categories
          </p>
        </div>

        <div className="mt-10">
          <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
            {features.map((feature) => (
              <div key={feature.name} className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                    <feature.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">{feature.name}</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">{feature.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
