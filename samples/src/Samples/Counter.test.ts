/*
 * MIT License
 *
 * Copyright (c) 2019 Rémi Van Keisbelck
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */

import { view, Msg } from "./Counter";
import { mount, shallow } from 'enzyme'


describe("Test Counter", () => {

    describe("view state", () => {

        const noop = () => { }

        test("render counter", () => {
            const wrapper = shallow(view(noop, 13))
            expect(wrapper.find('.counter')).toExist();
            expect(wrapper.find('.counter > span')).toHaveText("13");
        });

        test("render buttons", () => {
            const wrapper = shallow(view(noop, 1));
            expect(wrapper.find('.counter > button')).toHaveLength(2);
            expect(wrapper.find('.counter > button').at(0)).toHaveText('-');
            expect(wrapper.find('.counter > button').at(1)).toHaveText('+');
        });

        test("snapshot", () => {
            const wrapper = shallow(view(noop, 1313))
            expect(wrapper).toMatchSnapshot();
        });
    });

    describe("clicks generate messages", () => {

        var captured: Msg | undefined;
        const captureMsg = (msg: Msg) => captured = msg

        beforeEach(() => {
            captured = undefined;
        });

        test("decrement", () => {
            const wrapper = shallow(view(captureMsg, 1))
            wrapper.find('.counter > button').at(0).simulate('click')
            expect(captured).toEqual({ type: "dec" })
        });

        test("increment", () => {
            const wrapper = shallow(view(captureMsg, 1))
            wrapper.find('.counter > button').at(1).simulate('click')
            expect(captured).toEqual({ type: "inc" })
        });

    });
});

