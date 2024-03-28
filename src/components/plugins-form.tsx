"use client";

import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "./ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormControl,
} from "./ui/form";
import { Switch } from "./ui/switch";
import { ActivePlugins } from "@/types/context";
import { fromCamelToCapitalized } from "@/lib/utils";

const PluginsFormSchema = z.object({
  inspect: z.boolean().default(false),
  responsiveIndicator: z.boolean().default(false),
  classEditor: z.boolean().default(false),
});

interface PluginsConfig {
  name: keyof ActivePlugins;
  description: string;
  disabled: boolean;
}

const pluginsConfig: Array<PluginsConfig> = [
  {
    name: "inspect",
    description: "Enable inspect mode to view tailwind class names",
    disabled: true,
  },
  {
    name: "responsiveIndicator",
    description: "Enable responsive indicator to view screen sizes",
    disabled: false,
  },
  {
    name: "classEditor",
    description: "Enable class editor to edit tailwind classes",
    disabled: false,
  },
];

type PluginsFormValues = z.infer<typeof PluginsFormSchema>;

type PluginsFormProps = {
  handlePluginActivation: (values: ActivePlugins) => void;
  defaultValues: PluginsFormValues;
};

export const PluginsForm: React.FC<PluginsFormProps> = ({
  handlePluginActivation,
  defaultValues,
}) => {
  const form = useForm<PluginsFormValues>({
    resolver: zodResolver(PluginsFormSchema),
    defaultValues,
  });

  const onSubmit = (values: ActivePlugins) => {
    handlePluginActivation(values);
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div>
          {pluginsConfig.map((plugin) => (
            <div key={plugin.name} className="space-y-4">
              <FormField
                key={plugin.name}
                control={form.control}
                name={plugin.name}
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg p-4">
                    <div className="space-y-0.5 p-1">
                      <FormLabel className="text-sm text-white">
                        {fromCamelToCapitalized(plugin.name)}
                      </FormLabel>
                      <FormDescription className="text-neutral-400 text-xs">
                        {plugin.description}
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        aria-readonly
                        disabled={plugin.disabled}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          ))}
        </div>
        <Button
          variant={"outline"}
          type="submit"
          className="h-8 bg-neutral-100/90 backdrop-blur-xl border-neutral-400/70 text-black text-xs tracking-wide font-sans rounded-sm"
        >
          apply
        </Button>
      </form>
    </Form>
  );
};
