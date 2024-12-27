import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  "https://fobimptfejnrqpsrzoyw.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZvYmltcHRmZWpucnFwc3J6b3l3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM2NDI0OTYsImV4cCI6MjA0OTIxODQ5Nn0.hCbJzIR4nwKmXY08toq4BHyIXYPFMw_MJ8-ka0c6cF4"
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