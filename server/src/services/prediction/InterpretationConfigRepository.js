import fs from 'fs';
import path from 'path';

class InterpretationConfigRepository {
  constructor() {
    this.configPath = path.resolve(process.cwd(), 'src', 'config', 'interpretationConfig.json');
  }

  async load() {
    const raw = await fs.promises.readFile(this.configPath, 'utf-8');
    return JSON.parse(raw);
  }

  async save(config) {
    await fs.promises.writeFile(this.configPath, JSON.stringify(config, null, 2), 'utf-8');
    return config;
  }
}

export default InterpretationConfigRepository;
