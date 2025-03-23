import { Component, OnInit } from "@angular/core";
import * as $ from 'jquery';

@Component({
    selector: "app-speed-typing-test-app",
    templateUrl: "./speed-typing-test-app.component.html"
})
export class SpeedTypingTestAppComponent implements OnInit {

    //#region Variables

    private _paraItems: Array<string[]> = [];
    public paraIndex: number = 0;
    private _maxCharacter: number = 1500;

    public hasStarted: boolean = false;
    public timeLeft: number = 60;
    private _timer;

    private _wordsTyped: number = 0;
    private _wordsTypedWrong: number = 0;
    public grossSpeed: number = 0;
    public netSpeed: number = 0;
    public accuracy: number = 0;
    public isFinished: boolean = false;

    private _currentPara: Array<string> = [];
    private _currentInputWordIndex: number = 1;
    private _paraValue: string = "";
    private _currentInputWord: string = "";

    //#endregion

    //#region Page Load

    constructor() {

    }

    ngOnInit(): void {
        this.getFiles();
        this.setKeyInputEvent();
    }

    //#endregion

    //#region Private Functions

    private getFiles(): void {
        this._paraItems = [];
        this._wordsTyped = 0;
        this._wordsTypedWrong = 0;
        for (let m = 0; m < 5; m++) {
            fetch('assets/speed-typing-test-app/para-' + (m + 1) + '.txt')
                .then(response => response.text())
                .then(text => {
                    this._paraItems.push(text.split(' '));
                    if (m == 4)
                        this.displayParagraph();
                });
        }

    }

    private displayParagraph(): void {
        $("#para-display").html(this.setParagraphContent());
        $("#" + (this._currentInputWordIndex)).css({ "color": "blue", "background-color": "lightgreen" });
    }

    private setParagraphContent(): string {
        let charCount: number = 0;
        let cc = 0;
        this._currentInputWordIndex = 1;
        this._currentPara = [];
        while (true) {
            if (this._paraItems[this.paraIndex].length == 0) {
                break;
            }
            if (charCount + this._paraItems[this.paraIndex][0].length + 1 > this._maxCharacter)
                break;

            charCount += this._paraItems[this.paraIndex][0].length + 1;
            this._currentPara.push("<span id='" + (cc + 1) + "'>"
                + this._paraItems[this.paraIndex][0]
                + "</span>");
            this._paraItems[this.paraIndex].shift();
            cc++;
        }
        return this._currentPara.join(' ');
    }

    private isWordCorrect(): boolean {
        if (this._currentInputWord === $("#" + (this._currentInputWordIndex)).text())
            return true;

        this._wordsTypedWrong++;
        return false;
    }

    private resetParameters(): void {
        this._paraValue = "";
        this._currentInputWord = "";
        $("#paraInput").html(this._paraValue);
        this.timeLeft = 60;
        this.grossSpeed = this._wordsTyped;
        this.netSpeed = this._wordsTyped - this._wordsTypedWrong;
        this.accuracy = this._wordsTyped == 0 ? 0 : (this._wordsTyped - this._wordsTypedWrong)/this._wordsTyped;
        this._wordsTyped = 0;
        this._wordsTypedWrong = 0;
        this.hasStarted = false;
          
    }

    //#endregion

    //#region Component Functions

    public progressParagraph(): void {
        if (this._paraItems[this.paraIndex].length == 0) {
            if (this.paraIndex == 4) {
                this.paraIndex = 0;
                this.getFiles();
                return;
            }
            else
                this.paraIndex++;
            $("#para-display").html(this.setParagraphContent());
            $("#" + (1)).css({ "color": "blue", "background-color": "lightgreen" });
        }
        else {
            $("#para-display").html(this.setParagraphContent());
            $("#" + (1)).css({ "color": "blue", "background-color": "lightgreen" });
        }
    }

    

    public setKeyInputEvent(): void {

        $(document).keypress((key) => {

            if (!this.hasStarted) {
                this.hasStarted = true;
                this.isFinished = false;
                this._timer = setInterval(() => {
                    if (this.timeLeft - 1 == -1) {
                        alert("Time's Up!!!");
                        this.resetParameters();                                          
                        clearInterval(this._timer);
                        this.isFinished = true;  
                        this.getFiles();
                    } else {
                        this.timeLeft--;
                        this.isFinished = false;
                    }
                }, 1000);
            }

            let keyPressed: string = key.originalEvent.key;
            if (keyPressed == ' ') {

                this._wordsTyped++;

                $("#" + this._currentInputWordIndex).css({ "color": "black", "background-color": "white" });
                $("#" + (this._currentInputWordIndex + 1)).css({ "color": "blue", "background-color": "lightgreen" });

                if (this._currentInputWordIndex == this._currentPara.length) {
                    this.progressParagraph();
                    return;
                }
                if (this.isWordCorrect())
                    this._paraValue += ' ' + this._currentInputWord;
                else
                    this._paraValue += " <span class='text-danger'>" + this._currentInputWord + "</span>";

                this._currentInputWordIndex++;

                $("#paraInput").html(this._paraValue);

                this._currentInputWord = "";

            } else {
                this._currentInputWord += keyPressed;
                $("#paraInput").html(this._paraValue + ' ' + this._currentInputWord);
            }
        });

        $(document).keydown((key) => {
            let keyPressed = key.originalEvent.key;

            if (keyPressed == "Backspace" && this._currentInputWord != "")
                this._currentInputWord = this._currentInputWord.slice(0, this._currentInputWord.length - 1);
            else if(keyPressed == "Escape" && this.hasStarted) {
                clearInterval(this._timer);
                console.log("Cancelled")
                this.resetParameters();
                this.isFinished = false;  
                this.getFiles();
            }

            $("#paraInput").html(this._paraValue + ' ' + this._currentInputWord);
        });
    }

    //#endregion

}