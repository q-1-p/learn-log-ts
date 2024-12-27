import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

export const findAll = async (): Promise<Record[]> => {
    const records = await supabase.from("study-record").select("*");
    return records.data as Record[];
}

export const save = async (record: Record) => {
    const { error } = await supabase
        .from("study-record")
        .insert({
            title: record.title,
            time: record.time
        });
    
    if (error) {
        console.error("Error saving record:", error);
        throw error;
    }
}

export const deleteRecord = async (id: string) => {
    const { error } = await supabase
        .from("study-record")
        .delete()
        .eq("id", id);
    
    if (error) {
        console.error("Error deleting record:", error);
        throw error;
    }
}

export class Record {
    public id: string;
    public title: string;
    public time: number;

    constructor(id: string, title: string, time: number) {
        this.id = id;
        this.title = title;
        this.time = time;
    }
}