#!/usr/bin/env node --import=tsx/esm
import * as c from "./content";
import * as p from "@clack/prompts";
import chalk from "chalk";
import path from "path";
import os from "os";
import { promisify } from 'util';
import { exec } from 'child_process';
import fs from 'node:fs/promises';

const execute = promisify(exec);
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const DEFAULT_PATH = path.join(os.homedir(), "MIMI", "coding", "code_practices");
const DEFAULT_APP_PATH = path.join(os.homedir(), "MIMI", "coding");

async function sutato() {
    p.box(c.content, c.title(' Welcome to スタト！'), {
    contentAlign: 'center',
    titleAlign: 'center',
    width: 'auto',
    rounded: true,
});

    const name = await p.text({
        message: c.primary("Project Name:"),
        placeholder: "New-Project",
    });
    if (p.isCancel(name)) {
        p.log.error(chalk.red("スタト setup is cancelled!⋆˙⟡♡"));
        process.exit(0);
    }

     p.log.success(chalk.red("NAME setup is 完成しました!⋆˙⟡♡"));

    const type = await p.select({
        message: c.secondary("Project Type:"),
        options: [
            { value: "python", label: "Python", hint: "runs uv with a virtual environment setup" },
            { value: "typescript", label: "Typescript", hint: "runs vite@latest + typescript" },
            {value: "electron", label: "Electron", hint: "runs electron + ts with a basic setup"},
        ],
    });

      if (p.isCancel(type)) {
        p.log.error(chalk.red("スタト setup is cancelled!⋆˙⟡♡"));
        process.exit(0);
    }

        p.log.success(chalk.red("TYPE setup 完成しました!⋆˙⟡♡"));


    // Setup confirmation
    const conf = await p.confirm({
        message: c.primary(`Confirm setup for ${name.toString()} (${type.toString()})?`),
    });

    if (p.isCancel(conf)) {
    p.log.info(c.secondary('Operation cancelled'));
    process.exit(0);
    }

    if (conf) {
        const spin = p.spinner();
        spin.start(c.primary('Creating project...'));
        if (type === "python") {
            try {
            spin.message(c.primary('Setting up Python project...'));
            process.chdir(path.resolve(process.cwd(), DEFAULT_PATH));
            await sleep(1000); // Simulate some delay for better UX
            await execute(`uv init ${name.toString()}`);
            spin.message(c.primary('Setting up virtual environment...'));
            process.chdir(path.resolve(process.cwd(), name.toString()));
            await sleep(1000);
            await execute(`uv venv`);

            if (spin.isCancelled){
                return;
            }
            spin.stop(c.title('Project created successfully!'));
            }
            catch (error) {
                spin.error(c.title('Failed to create project!'));
                 p.log.error(chalk.red(`Error: ${error instanceof Error ? error.message : String(error)}`));
                 process.exit(1);
            }
          }
        if (type === "typescript") {
            try {
            spin.message(c.primary('Setting up Typescript project...'));
            process.chdir(path.resolve(process.cwd(), DEFAULT_APP_PATH));
            await sleep(1000);
            await execute(`npm create vite@latest ${name.toString()} -- --template react-ts`);
            spin.message(c.primary('Installing dependencies...'));
            const COMPONENT_FOLDER = path.join(name.toString(), "src");
            process.chdir(path.resolve(process.cwd(), COMPONENT_FOLDER));
            await sleep(1000);
            await execute(`mkdir components`);
            spin.message(c.primary('Adding components folder...'));

            if (spin.isCancelled){
                return;
            }
            spin.stop(c.title('Project created successfully!'));
        }
        catch (error) {
            spin.error(c.title('Failed to create project!'));
            p.log.error(chalk.red(`Error: ${error instanceof Error ? error.message : String(error)}`));
            process.exit(1);
        }
    }
        if (type === "electron") {
            try{
            spin.message(c.primary('Setting up Electron project...'));
            await sleep(2000);
            process.chdir(path.resolve(process.cwd(), DEFAULT_APP_PATH));
            await execute(`npm create vite@latest ${name.toString()} -- --template electron-ts`);
            spin.message(c.primary('Installing dependencies...'));
            const COMPONENT_FOLDER = path.join(name.toString(), "src");
            process.chdir(path.resolve(process.cwd(), COMPONENT_FOLDER));
            await sleep(2000);
            await execute(`mkdir components`);
            spin.message(c.primary('Adding components folder...'));

            if (spin.isCancelled){
                return;
            }
            spin.stop(c.title('Project created successfully!'));
        } catch (error) { 
            spin.error(c.title('Failed to create project!'));
            p.log.error(chalk.red(`Error: ${error instanceof Error ? error.message : String(error)}`));
            process.exit(1);
    }
    }
        spin.stop(c.title('Base project created successfully!'));

        if (type === "typescript" || type === "electron") {
            const addFramework = await p.confirm({
                message: c.primary("Would you like to add additional frameworks?"),
            });

            if (p.isCancel(addFramework)) {
                p.log.info(c.secondary('Operation cancelled'));
                process.exit(0);
            }
            else if (addFramework) {  
            const framework = await p.groupMultiselect({
                message: c.secondary("Select additional frontend frameworks to install:"),
                  options: {
                [c.title('Aesthetics first, baby gurl ⊹ ˖ Ი𐑼')] : [
                { value: 'tailwindcss', label: c.secondary('Tailwind CSS'), hint: 'A utility-first CSS framework' },
                { value: 'bootstrap', label: c.secondary('Bootstrap'), hint: 'The most popular HTML, CSS, and JS framework' },
                { value: '@picocss/pico', label: c.secondary('Pico CSS'), hint: 'Low cortisol CSS framework' },
                {value: 'nes.css', label: c.secondary('NES CSS'), hint: 'CSS components similar to NES-style games' },
                ],
                [c.title('UI libraries for that sass *¨`*•✿')] : [
                { value: '@chakra-ui/react @emotion/react', label: c.secondary('Chakra UI'), hint: 'A simple, modular and accessible component library' },
                { value: 'daisyui@latest', label: c.secondary('DaisyUI'), hint: 'A Tailwind CSS component library' },
                { value: 'lucide-react', label: c.secondary('Lucide React'), hint: 'Beautifully simple SVG icons, built as a fork of Feather' },
                { value: 'framer-motion', label: c.secondary('Framer Motion'), hint: 'A production-ready motion library for React' },
                ],
             },
         });
            if (p.isCancel(framework)) {
                p.log.info(c.secondary('Operation cancelled'));
                process.exit(0);
            } p.log.success(c.secondary('Framework selection complete!')); 
            spin.start(c.primary('Installing selected frameworks...'));
            await sleep(1000);
            process.chdir(path.resolve(process.cwd(), ".."));   
            const packages = Object.values(framework).flat();   

            if (packages.length > 0) {
                try {
                spin.message(c.primary('Joining packages for best outcome...'));
                spin.message(c.primary('Battling cosmic entities...'));
                await execute (`npm install ${packages.join(' ')}`);
                spin.stop(c.title('Selected frameworks installed successfully!'));
                p.log.success(c.primary('Your project is aesthetically done~'));
                } catch (error) {
                    p.log.error(chalk.red(`Failed to install selected frameworks: ${error instanceof Error ? error.message : String(error)}`));
                }
             }     
          }
      }
  }

    p.box(c.primary('Setup is complete! Please check your project files.'), c.title(' SETUPを完成しました!'), {
    contentAlign: 'center',
    titleAlign: 'center',
    width: 'auto',
    rounded: true,
});

}

sutato();
