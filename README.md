# Usage
Use in any terminal. Call:
```
sutato
```
And just follow instructions.

### Change the file path name to current path in `index.ts`:
```
const DEFAULT_PATH = path.join(os.homedir(), "MIMI", "coding", "code_practices");
const DEFAULT_APP_PATH = path.join(os.homedir(), "MIMI", "coding");
```
`APP_PATH` is separated because Vite makes the project's own folder.
- Python call uses `uv init` + `venv`, recommended to have that in environment variables if ever.
> *currently has Python, Typescript, Electron scaffolding*
