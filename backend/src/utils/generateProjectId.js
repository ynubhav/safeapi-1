import { nanoid } from 'nanoid';

const generateProjectId=(length)=>{
    return nanoid(length);
}

export { generateProjectId }