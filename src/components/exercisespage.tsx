import { Exercise } from './exercise';
import ExerciseData from '../interfaces/exerciseData';
import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';

export function ExercisesPage({
    allExData,
    setAllExData,
    defaultTags
}:{
    allExData: (ExerciseData | undefined)[];
    setAllExData: ((newData: (ExerciseData | undefined)[]) => void);
    defaultTags: string[];
}){
    useEffect(() => {
        //fetch();
        if(exList.length === 0) {
            if(tags.length === 0 && diff === "All" && voices === 0) setExList(allExData.sort(exSortFunc));
            else if(tags.length > 0 && diff === "All" && voices === 0 && !upd) {
                sortExercises(tags);
                setUpd(true);
            }
        }
    })

    const [diff, setDiff] = useState<string>("All");
    const [voices, setVoices] = useState<number>(0);
    const [tags, setTags] = useState<string[]>(defaultTags);
    const [upd, setUpd] = useState<boolean>(false);
    const [selExercise, setSelExercise] = useState<ExerciseData |  undefined>(undefined);
    const [exList, setExList] = useState<(ExerciseData | undefined)[]>([]);

    const sortExercises = function (input: string | string[] | number) {
        var tempTags = tags, tempDiff = diff, tempVoices = voices;
        if (typeof(input) === "object") tempTags = input;
        else if (typeof(input) === "string") tempDiff = input;
        else if (typeof(input) === "number") tempVoices = input;
        var list: (ExerciseData | undefined)[] = [];
        var method = "all";
        if (tempTags.length === 0 && tempDiff === "All" && tempVoices === 0) method = "";
        else if (tempDiff === "All" && tempVoices === 0) method = "tags";
        else if (tempTags.length === 0 && tempVoices === 0) method = "diff";
        else if (tempTags.length === 0 && tempDiff === "All") method = "voices";
        else if (tempVoices === 0) method = "diffTags";
        else if (tempTags.length === 0) method = "diffVoices";
        else if (tempDiff === "All") method = "tagsVoices";
        //console.log(method);
        switch (method) {
            case "diff": // only diff selected
                list = allExData.filter(function(exercise) {
                    if (exercise !== undefined) 
                        return tempDiff === String(exercise.difficulty) 
                    else return false;})
                        .sort(exSortFunc);
                    
                setExList(list);
                break;
            case "tags": // only tags selected
                list = allExData.filter(function(exercise) {
                    if (exercise !== undefined && tempTags !== undefined && exercise.tags !== undefined){
                        return (tempTags.sort().toString() === exercise.tags.sort().toString())}
                    else return false;})
                        .sort(exSortFunc);
                setExList(list);
                break;
            case "voices": // only voices selected
                list = allExData.filter(function(exercise) {
                    if (exercise !== undefined) 
                        return tempVoices === exercise.voices
                    else return false;})
                        .sort(exSortFunc);
                setExList(list);
                break;
            case "diffTags": // diff and tags selected (no voices)
                list = allExData.filter(function(exercise) {
                    if (exercise !== undefined && tempTags !== undefined && exercise.tags !== undefined){
                        return (tempTags.sort().toString() === exercise.tags.sort().toString()) && tempDiff === String(exercise.difficulty)}
                    else return false;})
                        .sort(exSortFunc)
                setExList(list);
                break;
            case "diffVoices": // diff and voices selected (no tags)
                list = allExData.filter(function(exercise) {
                    if (exercise !== undefined) 
                        return (tempDiff === String(exercise.difficulty) && tempVoices === exercise.voices)
                    else return false;})
                        .sort(exSortFunc);
                setExList(list);
                break;
            case "tagsVoices": // tags and voices selected (no diff)
                list = allExData.filter(function(exercise) {
                    if (exercise !== undefined && tempTags !== undefined && exercise.tags !== undefined){
                        return (tempTags.sort().toString() === exercise.tags.sort().toString()) && tempVoices === exercise.voices}
                    else return false;})
                        .sort(exSortFunc);
                setExList(list);
                break;
            case "all": // all sorting options selected
                list = allExData.filter(function(exercise) {
                    if (exercise !== undefined && tempTags !== undefined && exercise.tags !== undefined){
                        return (tempTags.sort().toString() === exercise.tags.sort().toString()) && tempDiff === String(exercise.difficulty) && tempVoices === exercise.voices}
                    else return false;})
                        .sort(exSortFunc);
                setExList(list);
                break;
            default:
                list = allExData.sort(exSortFunc)
                setExList(list);
                break;
        }
    }

    const exSortFunc = function (e1: ExerciseData | undefined, e2: ExerciseData | undefined): number {
        if (e1 !== undefined && e2 !== undefined) {
            try {
                if(e1.title.startsWith("Exercise ")) return 1;
                else if(e2.title.startsWith("Exercise ")) return -1;
                var e1Sorted = e1.tags.sort().length;
                var e2Sorted = e2.tags.sort().length;
                if (e1Sorted > e2Sorted) return 1;
                else if (e1Sorted < e2Sorted) return -1;
                else {
                    if (e1.title > e2.title) return 1;
                    else if (e1.title < e2.title) return -1;
                    else {
                        if(e1.difficulty > e2.difficulty) return 1;
                        else if(e1.difficulty < e2.difficulty) return -1;
                        else return 0;
                    }
                }
            } catch {
                if(e1.title > e2.title) return 1;
                else if(e1.title < e2.title) return -1;
                else return 0;
            };
        } else return 0;
    }

    const exChange = function (e:React.MouseEvent<HTMLSpanElement>){
        var ex = allExData.find((exercise: ExerciseData | undefined) => {if (exercise !== undefined && exercise.title === (e.target as Element).id){return exercise} else {return undefined}})
        var nBtn = document.getElementById("next-btn");
        var bBtn = document.getElementById("back-btn");
        if(exList.indexOf(ex) === (exList.length - 1)) {
            if (nBtn !== null && "disabled" in nBtn) {
                nBtn.disabled = true;
                nBtn.hidden = false;
            }
        }
        else {
            if (nBtn !== null && "disabled" in nBtn) {
                nBtn.disabled = false;
                nBtn.hidden = false;
            }
        }
        if(exList.indexOf(ex) === 0) {
            if (bBtn !== null && "disabled" in bBtn) {
                bBtn.disabled = true;
                bBtn.hidden = false;
            }
        }
        else {
            if (bBtn !== null && "disabled" in bBtn) {
                bBtn.disabled = false;
                bBtn.hidden = false;
            }
        }
        setSelExercise(ex);
    }

    //onClick function for diff change
    const diffChange = function (e: React.ChangeEvent<HTMLSelectElement>) {
        setDiff((e.target.value));
        sortExercises(e.target.value);
    }

    //onClick function for tags change
    const tagsChange = function (e: React.ChangeEvent<HTMLInputElement>) {
        let val = e.target.value;
        if(tags.includes(val)) {
            tags.splice(tags.indexOf(val), 1);
            setTags([...tags]);
            sortExercises([...tags]);
        } else {
            setTags([...tags, val]);
            sortExercises([...tags, val]);
        } 
    }

    //onClick function for voices change
    const voiceChange = function (e: React.ChangeEvent<HTMLSelectElement>) {
        setVoices(Number(e.target.value));
        sortExercises(Number(e.target.value));
    }

    //onClick function for when Back button is pushed under exercise
    const prevEx = function () {
        var exPos = exList.indexOf(selExercise);
        var bBtn = document.getElementById("back-btn");
        var nBtn = document.getElementById("next-btn");
        if(exPos !== -1) {
            setSelExercise(exList[exPos-1]);
            if (exPos-1 > 0) {
                if (bBtn !== null && "disabled" in bBtn) bBtn.disabled = false;
            }
            else {
                if (bBtn !== null && "disabled" in bBtn) bBtn.disabled = true;
            }
        } else {
            setSelExercise(exList[0]);
            if (bBtn !== null && "disabled" in bBtn) bBtn.disabled = true;
        }
        if (exList.length < 2) {
            if (nBtn !== null && "disabled" in nBtn) nBtn.disabled = true;
        } else {
            if (nBtn !== null && "disabled" in nBtn) nBtn.disabled = false;
        }
    }

    //onClick function for when Next button is pushed under exercise
    const nextEx = function () {
        var bBtn = document.getElementById("back-btn");
        var nBtn = document.getElementById("next-btn");
        var exPos = exList.indexOf(selExercise);
        setSelExercise(exList[exPos+1]);
        if (exPos+1 >= (exList.length - 1)) {
            if (nBtn !== null && "disabled" in nBtn && exPos !== -1) nBtn.disabled = true;
        }
        else {
            if (nBtn !== null && "disabled" in nBtn) nBtn.disabled = false;
        }
        if (exList.length < 2 || exPos === -1) {
            if (bBtn !== null && "disabled" in bBtn) bBtn.disabled = true;
        } else {
            if (bBtn !== null && "disabled" in bBtn) bBtn.disabled = false;
        }
    }

    //onClick to reset all exercise sort fields
    const resetSort = function () {
        setTags([]);
        setDiff("All");
        var diffBox = document.getElementsByName("difficulty")[0] as HTMLSelectElement;
        if (diffBox !== null) diffBox.options[0].selected = true;
        setVoices(0);
        var voiceBox = document.getElementsByName("voices")[0] as HTMLSelectElement;
        if (voiceBox !== null) voiceBox.options[0].selected = true;
    }

    return (
        <div style={{margin: "10px"}}>
            <h2>Welcome to the Exercises Page!</h2>
            <h5 style={{fontStyle: "italic"}}>Sort by tags, difficulty, and voices, then click an exercise to get started.</h5>
            <div style={{float:'left', width: "30%"}}>
                <span>
                    <form id= "tags">
                        <div style={{fontSize:"16px", display:"inline"}}>Tags:</div>
                        <br></br>
                        <input type="checkbox" name="tags" value="Pitch" checked={tags.includes("Pitch")} onChange={tagsChange}style={{margin: "4px"}}/>Pitch
                        <input type="checkbox" name="tags" value="Intonation" checked={tags.includes("Intonation")} onChange={tagsChange} style={{marginLeft: "12px"}}/> Intonation
                        <input type="checkbox" name="tags" value="Drone" checked={tags.includes("Drone")} onChange={tagsChange} style={{marginLeft: "12px"}}/> Drone
                        <input type="checkbox" name="tags" value="Ensemble" checked={tags.includes("Ensemble")} onChange={tagsChange} style={{marginLeft: "12px"}}/> Ensemble
                        {/* <input type="checkbox" name="tags" value="Rhythm" checked={tags.includes("Rhythm")} onChange={tagsChange}/>Rhythm */}
                    </form>
                    <div id="dropdowns" style={{display: "inline-flex", padding: "4px"}}>
                        <form id="difficulty">
                            <div style={{fontSize:"16px", display:"inline"}}>Difficulty:</div>
                            <br></br>
                            <select name="difficulty" onChange={diffChange}>
                                <option value="All">All</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                                {/* <option value="6">6</option>
                                <option value="7">7</option>
                                <option value="8">8</option>
                                <option value="9">9</option>
                                <option value="10">10</option> */}
                            </select>
                        </form>
                        <form id="voiceCt">
                            Voices
                            <br></br>
                            <select name="voices" onChange={voiceChange}>
                                <option value={0}>Any</option>
                                <option value={1}>1</option>
                                <option value={2}>2</option>
                                <option value={3}>3</option>
                                <option value={4}>4</option>
                                <option value={5}>5</option>
                                {/* <option value="6">6</option>
                                <option value="7">7</option>
                                <option value="8">8</option>
                                <option value="9">9</option>
                                <option value="10">10</option> */}
                            </select>
                        </form>
                        <Button variant="danger" onClick={resetSort} style={{marginLeft: "10px"}}>Reset Sort</Button>
                    </div>
                </span>
                
                {exList.map(function(exercise){
                    if(exercise !== undefined) {
                        return (
                        <div key = {exercise.title} id = {exercise.title} onClick={exChange} style={{margin: "8px", padding: "6px", cursor: "pointer", backgroundColor: "#fcfcd2", borderRadius: "2px"}}>
                            {exercise.title}
                        </div>
                        )}
                    else return <></>;
                })}
                {exList.length === 0 ? <div>No exercises with those criteria found!</div> : <></>}
            </div>
            <div style={{float:'right',width:'70%'}}>
                {selExercise !== undefined ? <div>
                    <Exercise key={selExercise.exIndex} teacherMode={false} ExData={selExercise} allExData={allExData} setAllExData={setAllExData} exIndex={selExercise.exIndex} setNewExercise={undefined}/>
                    
                </div> : <></>}
            <div style={{display:"flex", justifyContent: "center"}}>
                <button style={{width: "5%"}}id="back-btn" hidden={true} disabled={false} onClick={prevEx}>Back</button>
                <button style={{width: "5%"}} id="next-btn" hidden={true} disabled={false} onClick={nextEx}>Next</button>
            </div>
                
            </div>
            
            <br></br>


            
            {/* <Button variant="success" onClick={fetch}>Sync with Database</Button> */}
            {/* <Exercise teacherMode ={false} allExData = {allExData} setAllExData = {setAllExData}files ={files} setFiles={setFiles} exIndex={0}></Exercise>

            <Exercise teacherMode ={false} allExData = {allExData} setAllExData = {setAllExData} files ={files} setFiles={setFiles} exIndex={1}></Exercise> */}
        </div>

    );
}