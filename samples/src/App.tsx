import React from 'react';
import {Cmd, Dispatcher, ProgramWithNav, map, Sub, noCmd} from "react-tea-cup";
import * as Counter from './Samples/Counter'
import * as ParentChild from './Samples/ParentChild'
import * as Raf from './Samples/Raf'
import * as Perf from './Samples/Perf'
import * as Rand from './Samples/Rand'
import * as ClassMsgs from './Samples/ClassMsgs'
import * as Sful from './Samples/StatefulInView'


interface Model {
    readonly counter: Counter.Model
    readonly parentChild: ParentChild.Model
    readonly raf: Raf.Model
    readonly perf: Perf.Model
    readonly rand: Rand.Model
    readonly clsm: ClassMsgs.Model
    readonly sful: Sful.Model
    readonly hash: string;
}


type Msg
    = { type: "counter", child: Counter.Msg }
    | { type: "parentChild", child: ParentChild.Msg }
    | { type: "raf", child: Raf.Msg }
    | { type: "perf", child: Perf.Msg }
    | { type: "rand", child: Rand.Msg }
    | { type: "clsm", child: ClassMsgs.Msg }
    | { type: "sful", child: Sful.Msg }
    | { type: "urlChange", location: Location }
    

function init(location:Location): [Model, Cmd<Msg>] {

    const counter = Counter.init();
    const parentChild = ParentChild.init();
    const raf = Raf.init();
    const perf = Perf.init();
    const rand = Rand.init();
    const clsm = ClassMsgs.init();
    const sful = Sful.init();
    const h = location.hash.startsWith("#") ? location.hash.substring(1) : location.hash;
    return [
        {
            counter: counter[0],
            parentChild: parentChild[0],
            raf: raf[0],
            perf: perf[0],
            rand: rand[0],
            clsm: clsm[0],
            sful: sful[0],
            hash: h
        },
        Cmd.batch([
            counter[1].map(mapCounter),
            parentChild[1].map(mapParentChild),
            raf[1].map(mapRaf),
            perf[1].map(mapPerf),
            rand[1].map(mapRand),
            clsm[1].map(mapClsm),
            sful[1].map(mapSful),
        ])
    ]
}


function mapCounter(m: Counter.Msg) : Msg {
        return {
                type: "counter",
                child: m
        }
}

function mapParentChild(m: ParentChild.Msg) : Msg {
        return {
                type: "parentChild",
                child: m
        }
}

function mapRaf(m: Raf.Msg) : Msg {
        return {
                type: "raf",
                child: m
        }
}

function mapPerf(m: Perf.Msg) : Msg {
        return {
                type: "perf",
                child: m
        }
}

function mapRand(m: Rand.Msg) : Msg {
    return {
        type: "rand",
        child: m
    }
}


function mapClsm(m: ClassMsgs.Msg) : Msg {
    return {
        type: "clsm",
        child: m
    }
}


function mapSful(m: Sful.Msg) : Msg {
    return {
        type: "sful",
        child: m
    }
}


function view(dispatch: Dispatcher<Msg>, model: Model) {

    function navItem(hash:string, label:string) {
        if (hash === model.hash) {
            return <span>{label}</span>;
        } else {
            return (
                <a href={"#" + hash}>
                    {label}
                </a>
            )
        }
    }


    const nav =
        <ul>
            <li>{navItem("", "Home")}</li>
            <li>{navItem("foo", "Foo")}</li>
            <li>{navItem("bar", "Bar")}</li>
        </ul>;


    return (
        <div>
            <h1>Samples</h1>
            <p>
                This is the samples app for <code>react-tea-cup</code>.
            </p>
            <h2>Counter</h2>
            {Counter.view(map(dispatch, mapCounter), model.counter)}
            <h2>Random</h2>
            {Rand.view(map(dispatch, mapRand), model.rand)}
            <h2>Parent/child</h2>
            {ParentChild.view(map(dispatch, mapParentChild), model.parentChild)}
            <h2>Raf</h2>
            {Raf.view(map(dispatch, mapRaf), model.raf)}
            <h2>Performance</h2>
            {Perf.view(map(dispatch, mapPerf), model.perf)}
            <h2>More OOP</h2>
            {ClassMsgs.view(map(dispatch, mapClsm), model.clsm)}
            <h2>Stateful in view()</h2>
            {Sful.view(map(dispatch, mapSful), model.sful)}
            <h2>Routing/Navigation</h2>
            <p>
                This shows how you can get notified of url changes
                in your program. For now we only use dummy href
                but we should use a more advanced url parser...
            </p>
            {nav}
        </div>
    )
}


function update(msg: Msg, model: Model): [Model, Cmd<Msg>] {
    switch (msg.type) {
        case "counter":
            const macCounter = Counter.update(msg.child, model.counter);
            return [{...model, counter: macCounter[0]}, macCounter[1].map(mapCounter)];
        case "parentChild":
            const macPc = ParentChild.update(msg.child, model.parentChild);
            return [{...model, parentChild: macPc[0]}, macPc[1].map(mapParentChild)];
        case "raf":
            const macRaf = Raf.update(msg.child, model.raf);
            return [{...model, raf: macRaf[0]}, macRaf[1].map(mapRaf)];
        case "perf":
            const macPerf = Perf.update(msg.child, model.perf);
            return [{...model, perf: macPerf[0]}, macPerf[1].map(mapPerf)];
        case "rand":
            const macRand = Rand.update(msg.child, model.rand);
            return [{...model, rand: macRand[0]}, macRand[1].map(mapRand)];
        case "clsm":
            const macClsm = ClassMsgs.update(msg.child, model.clsm);
            return [{...model, clsm: macClsm[0]}, macClsm[1].map(mapClsm)];
        case "sful":
            const macSful = Sful.update(msg.child, model.sful);
            return [{...model, sful: macSful[0]}, macSful[1].map(mapSful)];
        case "urlChange":
            const h = msg.location.hash;
            return noCmd({
                ...model,
                hash: h.startsWith("#") ? h.substring(1) : h
            });
    }

}


function subscriptions(model: Model) : Sub<Msg> {
    return Sub.batch(
        [
            Counter.subscriptions(model.counter).map(mapCounter),
            ParentChild.subscriptions(model.parentChild).map(mapParentChild),
            Raf.subscriptions(model.raf).map(mapRaf)
        ]
    )
}


function onUrlChange(l:Location) : Msg {
    return {
        type: "urlChange",
        location: l
    }
}


const App = () => (
    <ProgramWithNav
        init={init}
        view={view}
        update={update}
        subscriptions={subscriptions}
        onUrlChange={onUrlChange}
    />
);



export default App;
