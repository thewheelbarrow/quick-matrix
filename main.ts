import { Plugin, Editor, Modal, Setting, App } from 'obsidian'

export default class QuickMatrix extends Plugin {
	async onload(){
		this.addCommand({
			id: "bracket-matrix",
			name: "Bracket matrix",
			editorCallback: async (editor) => {
				await this.new_matrix("bmatrix", editor)
			}
		})
		this.addCommand({
			id: "determinant-matrix",
			name: "Determinant Matrix",
			editorCallback: async (editor) => {
				await this.new_matrix("vmatrix", editor)
			}
		})
	}

	private async new_matrix(type, editor) {
		let rowCount = Number(await new StringModal(this.app, "How many rows would you like?").openAndGetValue())
		let outputString = "$\\begin{".concat(type).concat("}")
		for (let row = 0; row < rowCount; row++) {
			let rowInput = await new StringModal(this.app, "Entries for the next row (seperated by spaces):").openAndGetValue()
			let entries = rowInput.split(" ")
			let rowString = ""
			for (let entryNo = 0; entryNo < entries.length; entryNo++) {
				rowString = rowString.concat(entries[entryNo])
				rowString = rowString.concat("&")
			}
			rowString = rowString.substring(0, rowString.length - 1)
			rowString = rowString.concat("\\\\")
			outputString = outputString.concat(rowString)
		}
		outputString = outputString.concat("\\end{").concat(type).concat("}$")
		editor.replaceRange(outputString, editor.getCursor())
	}
}

class StringModal extends Modal {
	textInput: HTMLInputElement
	isFirst: boolean = true
	constructor(app: App, title: string) {
		super(app)
		this.setTitle(title)
		this.textInput = this.contentEl.createEl("input", {attr: {type: "text", size: 58}})
	}
	openAndGetValue(): Promise<string> {
		return new Promise((resolve) => {
			this.textInput.addEventListener("keyup", (event) => {
				if (this.isFirst) {
					this.isFirst = false
					return
				}
				if (event.key == "Enter") {
					resolve(this.textInput.value)
					this.close()
				}
			})
			this.open()
		})
	}
}
