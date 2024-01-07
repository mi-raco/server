import dataAPI from './integrations/mongoDataAPI';

interface Template {
  role: string;
  content: string;
  name: string | null;
  function_call: any | null;
  tool_calls: any | null;
}

interface ModelConfig {
  model: string;
  temperature: number;
  top_p: number | null;
  stop: any | null;
  max_tokens: number;
  presence_penalty: number | null;
  frequency_penalty: number | null;
  logit_bias: any | null;
}

interface PromptVersion {
  _id: string;
  created_at: string;
  created_by_user_id: string;
  created_by_org_id: string;
  status: string;
  provider: string;
  name: string;
  description: string;
  prompt_id: string;
  template: Template[];
  model_config: ModelConfig;
  template_arg_names: string[];
}

export default {
  async getLivePromptVersion(actionId: string, data=dataAPI): Promise<PromptVersion> {
    const prompt = await data.findOne({
      collection: 'prompts', 
      filter: {name: actionId}
    })
    const promptVersion = await data.findOne({
      collection: 'promptVersions', 
      filter: {prompt_id: {"$oid": prompt.document._id}, status: "Live"}
    })
    .then((response) => response.document as PromptVersion);
    return promptVersion;
  },

  populateUserInputTemplate(promptVersion: PromptVersion, parameters: Record<string, string>) {
  const user_input = promptVersion.template[1].content.replace(
    /\${(\w+)}/g, 
    (_, v) => parameters[v]
  );
    return user_input;
  },
}