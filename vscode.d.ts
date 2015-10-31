/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/

declare namespace vscode {

	/**
	 * The command callback.
	 */
	export interface CommandCallback {

		/**
		 *
		 */
		<T>(...args: any[]): T | Thenable<T>;
	}

	/**
	 * Represents a command
	 */
	export interface Command {
		/**
		 * Title of the command, like _save_
		 */
		title: string;

		/**
		 * The identifier of the actual commend handler
		 */
		command: string;

		/**
		 * Arguments that the command-handler should be
		 * invoked with
		 */
		arguments?: any[];
	}

	export interface TextEditorOptions {
		tabSize: number;
		insertSpaces: boolean;
	}

	/**
	 * Represents a line of text such as a line of source code
	 */
	export interface TextLine {

		/**
		 * The zero-offset line number
		 *
		 * @readonly
		 */
		lineNumber: number;

		/**
		 * The text of this line without the
		 * newline character
		 *
		 * @readonly
		 */
		text: string;

		/**
		 * The range this line covers without the
		 * newline character
		 *
		 * @readonly
		 */
		range: Range;

		/**
		 * The range this line covers with the
		 * newline character
		 *
		 * @readonly
		 */
		rangeIncludingLineBreak: Range;

		/**
		 * The offset of the first character which
		 * isn't a whitespace character as defined
		 * by a `\s`-RegExp
		 *
		 * @readonly
		 */
		firstNonWhitespaceCharacterIndex: number;

		/**
		 * Whether this line is whitespace only, shorthand
		 * for `#firstNonWhitespaceCharacterIndex === #text.length`
		 *
		 * @readonly
		 */
		isEmptyOrWhitespace: boolean;
	}

	/**
	 * Represents a text document, such as a source file. Text documents have
	 * [lines](#TextLine) and knowledge about an underlying resource like a file.
	 */
	export interface TextDocument {

		/**
		 * Get the associated URI for this document. Most documents have the file://-scheme, indicating that they represent files on disk.
		 * However, some documents may have other schemes indicating that they are not available on disk.
		 *
		 * @readonly
		 */
		uri: Uri;

		/**
		 * Returns the file system path of the file associated with this document. Shorthand
		 * notation for `#uri.fsPath`
		 *
		 * @readonly
		 */
		fileName: string;

		/**
		 * Is this document representing an untitled file.
		 *
		 * @readonly
		 */
		isUntitled: boolean;

		/**
		 * The language identifier associated with this document.
		 *
		 * @readonly
		 */
		languageId: string;

		/**
		 * The version number of this document (it will strictly increase after each
		 * change, including undo/redo).
		 *
		 * @readonly
		 */
		version: number;

		/**
		 * true if there are unpersisted changes
		 *
		 * @readonly
		 */
		isDirty: boolean;

		/**
		 * Save the underlying file.
		 *
		 * @retun A promise that will resolve to true when the file
		 *  has been saved.
		 */
		save(): Thenable<boolean>;

		/**
		 * The number of lines in this document.
		 *
		 * @readonly
		 */
		lineCount: number;

		/**
		 * Returns a text line denoted by the line number. Note
		 * that the returned object is *not* live and changes to the
		 * document are not reflected.
		 *
		 * @param line A line number in (0, lineCount[
		 * @return A line.
		 */
		lineAt(line: number): TextLine;

		/**
		 * Returns a text line denoted by the position. Note
		 * that the returned object is *not* live and changes to the
		 * document are not reflected.
		 *
		 * @see ()[#lineAt]
		 * @param position A position which line is in (0, lineCount[
		 * @return A line.
		 */
		lineAt(position: Position): TextLine;

		/**
		 * Converts the position to a zero-based offset
		 */
		offsetAt(position: Position): number;

		/**
		 * Converts a zero-based offset to a position
		 */
		positionAt(offset: number): Position;

		/**
		 * Get the text in this document. If a range is provided the text contained
		 * by the range is returned.
		 */
		getText(range?: Range): string;

		/**
		 * Get the word under a certain position. May return null if position is at whitespace, on empty line, etc.
		 */
		getWordRangeAtPosition(position: Position): Range;

		/**
		 * Ensure a range sticks to the text.
		 */
		validateRange(range: Range): Range;

		/**
		 * Ensure a position sticks to the text.
		 */
		validatePosition(position: Position): Position;
	}

	/**
	 * Represents a line and character position, such as
	 * the position of the caret.
	 */
	export class Position {

		/**
		 * The zero-offset base line number.
		 */
		line: number;

		/**
		 * The zero-offset base character number
		 */
		character: number;

		/**
		 * @param line
		 * @param character
		 */
		constructor(line: number, character: number);

		/**
		 * @return `true` if position is on a smaller line
		 * or smaller character
		 */
		isBefore(other: Position): boolean;

		/**
		 * @return `true` if the postion is before or equal
		 * to this position.
		 */
		isBeforeOrEqual(other: Position): boolean;
	}

	/**
	 * A range represents an ordered tuple of two positions
	 */
	export class Range {

		/**
		 * The start position is before or equal to end.
		 */
		start: Position;

		/**
		 * The end position which is after or equal to start.
		 */
		end: Position;

		/**
		 * Create a new range from two position. If `start` is not
		 * before or equal to `end` the value will be swaped.
		 *
		 * @param start
		 * @param end
		 */
		constructor(start: Position, end: Position);

		/**
		 * Create a new range from two (line,character)-pairs. The parameters
		 * might be swapped so that start is before or equal to end.
		 */
		constructor(startLine: number, startColumn: number, endLine: number, endColumn: number);

		/**
		 * @return `true` iff the position or range is inside or equal
		 * to this range.
		 */
		contains(positionOrRange: Position | Range): boolean;

		/**
		 * `true` iff `start` and `end` are equal.
		 */
		isEmpty: boolean;

		/**
		 * `true` iff `start` and `end` are on the same line.
		 */
		isSingleLine: boolean;
	}

	export class Selection extends Range {

		anchor: Position;

		active: Position;

		constructor(anchor: Position, active: Position);

		constructor(anchorLine: number, anchorColumn: number, activeLine: number, activeColumn: number);

		isReversed: boolean;
	}

	export interface TextEditor {

		/**
		 * The document associated with this text editor. The document will be the same for the entire lifetime of this text editor.
		 */
		document: TextDocument;

		/**
		 * The primary selection on this text editor. In case the text editor has multiple selections this is the first selection as
		 * in `TextEditor.selections[0]`.
		 * @see [updateSelection](#updateSelection)
		 */
		selection: Selection;

		/**
		 * The selections in this text editor.
		 * @see [updateSelection](#updateSelection)
		 */
		selections: Selection[];

		/**
		 * Update the selection on this text editor. Changes the selection of the
		 * editor and allows to observe the result of the operation. Note: despite the
		 * editor being updated the UI updates with a little delay. This deplay
		 * can be observed using the promise returned form this operation.
		 */
		updateSelection(value: Position | Range | Selection | Selection[]): Thenable<TextEditor>;

		/**
		 * Text editor options.
		 */
		options: TextEditorOptions;

		/**
		 * Update text editor options and allows observe the result of the
		 * operations. Note: despite the editor being updated the UI updates with a
		 * little delay. This deplay can be observed using the promise returned form this operation.
		 */
		updateOptions(options: TextEditorOptions): Thenable<TextEditor>;

		/**
		 * Perform an edit on the document associated with this text editor.
		 * The passed in {{editBuilder}} is available only for the duration of the callback.
		 */
		edit(callback: (editBuilder: TextEditorEdit) => void): Thenable<boolean>;
	}

	/**
	 * Denotes a column in the VS Code window. Columns used to show editors
	 * side by side.
	 */
	export enum ViewColumn {
		One = 1,
		Two = 2,
		Three = 3
	}

	/**
	 * A complex edit that will be applied on a TextEditor.
	 * This holds a description of the edits and if the edits are valid (i.e. no overlapping regions, etc.) they can be applied on a Document associated with a TextEditor.
	 */
	export interface TextEditorEdit {
		/**
		 * Replace a certain text region with a new value.
		 */
		replace(location: Position | Range | Selection, value: string): void;

		/**
		 * Insert text at a location
		 */
		insert(location: Position, value: string): void;

		/**
		 * Delete a certain text region.
		 */
		delete(location: Range | Selection): void;

	}

	/**
	 * A universal resource identifier representing either a file on disk on
	 * or another resource, e.g untitled.
	 */
	export class Uri {

		constructor();
		static parse(path: string): Uri;
		static file(path: string): Uri;
		static create(path: string): Uri;

		/**
		 * scheme is the 'http' part of 'http://www.msft.com/some/path?query#fragment'.
		 * The part before the first colon.
		 */
		scheme: string;

		/**
		 * authority is the 'www.msft.com' part of 'http://www.msft.com/some/path?query#fragment'.
		 * The part between the first double slashes and the next slash.
		 */
		authority: string;

		/**
		 * path is the '/some/path' part of 'http://www.msft.com/some/path?query#fragment'.
		 */
		path: string;

		/**
		 * query is the 'query' part of 'http://www.msft.com/some/path?query#fragment'.
		 */
		query: string;

		/**
		 * fragment is the 'fragment' part of 'http://www.msft.com/some/path?query#fragment'.
		 */
		fragment: string;

		/**
		 * Retuns a string representing the corresponding file system path of this URI.
		 * Will handle UNC paths and normalize windows drive letters to lower-case. Also
		 * uses the platform specific path separator. Will *not* validate the path for
		 * invalid characters and semantics. Will *not* look at the scheme of this URI.
		 */
		fsPath: string;

		/**
		 * Returns a canonical representation of this URI. The representation and normalization
		 * of a URI depends on the scheme.
		 */
		toString(): string;

		toJSON(): any;
	}

	export interface CancellationToken {
		isCancellationRequested: boolean;
		onCancellationRequested: Event<any>;
	}

	export class CancellationTokenSource {

		token: CancellationToken;

		cancel(): void;

		dispose(): void;
	}

	/**
	 * Represents a type which can release resources, such
	 * as event listening or a timer.
	 */
	export class Disposable {

		/**
		 * Combine many disposable-likes into one. Use this method
		 * when having objects with a dispose function which are not
		 * instances of Disposable.
		 *
		 * @return Returns a new disposable which, upon dispose, will
		 * dispose all provides disposable-likes.
		 */
		static from(...disposableLikes: { dispose: () => any }[]): Disposable;

		/**
		 * Creates a new Disposable calling the provided function
		 * on dispose
		 * @param callOnDispose Function that disposes something
		 */
		constructor(callOnDispose: Function);

		/**
		 * Dispose this object.
		 */
		dispose(): any;
	}

	/**
	 * Represents a typed event.
	 */
	export interface Event<T> {

		/**
		 *
		 * @param listener The listener function will be call when the event happens.
		 * @param thisArgs The 'this' which will be used when calling the event listener.
		 * @param disposables An array to which a {{IDisposable}} will be added. The
		 * @return
		 */
		(listener: (e: T) => any, thisArgs?: any, disposables?: Disposable[]): Disposable;
	}

	/**
	 * A file system watcher notifies about changes to files and folders
	 * on disk. To get an instanceof of a {{FileSystemWatcher}} use
	 * {{workspace.createFileSystemWatcher}}.
	 */
	export interface FileSystemWatcher extends Disposable {

		/**
		 * Happens on file/folder creation.
		 */
		onDidCreate: Event<Uri>;

		/**
		 * Happens on file/folder change.
		 */
		onDidChange: Event<Uri>;

		/**
		 * Happens on file/folder deletion.
		 */
		onDidDelete: Event<Uri>;
	}

	/**
	 * Represents an item that can be selected from
	 * a list of items
	 */
	export interface QuickPickItem {

		/**
		 * The main label of this item
		 */
		label: string;

		/**
		 * A description
		 */
		description: string;
	}

	/**
	 *
	 */
	export interface QuickPickOptions {
		/**
		* an optional flag to include the description when filtering the picks
		*/
		matchOnDescription?: boolean;

		/**
		* an optional string to show as place holder in the input box to guide the user what she picks on
		*/
		placeHolder?: string;
	}

	/**
	 * Represents an actional item that is shown with an information, warning, or
	 * error message
	 *
	 * @see #window.showInformationMessage
	 * @see #window.showWarningMessage
	 * @see #window.showErrorMessage
	 */
	export interface MessageItem {

		/**
		 * A short title like 'Retry', 'Open Log' etc
		 */
		title: string;
	}

	/**
	 *
	 */
	export interface InputBoxOptions {
		/**
		* the value to prefill in the input box
		*/
		value?: string;

		/**
		* The text to display underneath the input box.
		*/
		prompt?: string;

		/**
		* an optional string to show as place holder in the input box to guide the user what to type
		*/
		placeHolder?: string;

		/**
		* set to true to show a password prompt that will not show the typed value
		*/
		password?: boolean;
	}

	/**
	 * A language filter denotes a document by different properties like
	 * the [language](#TextDocument.languageId), the (scheme)[#Uri.scheme] of
	 * it's resource, or a glob-pattern that is applied to the (path)[#Uri.fsPath]
	 *
	 * A language filter that applies to typescript files on disk would be this:
	 * ```
	 * { language: 'typescript', scheme: 'file' }
	 * ```
	 * a language filter that applies to all package.json files would be this:
	 * ```
	 * { language: 'json', pattern: '**\project.json' }
	 * ```
	 */
	export interface LanguageFilter {

		/**
		 * A language id, like `typescript`.
		 */
		language?: string;

		/**
		 * A Uri scheme, like `file` or `untitled`
		 */
		scheme?: string;

		/**
		 * A glob pattern, like `*.{ts,js}`
		 */
		pattern?: string;
	}

	/**
	 * A language selector is the combination of one or many language identifiers
	 * and (language filters)[#LanguageFilter]. Samples are
	 * `let sel:LanguageSelector = 'typescript`, or
	 * `let sel:LanguageSelector = ['typescript, { language: 'json', pattern: '**\tsconfig.json' }]`
	 */
	export type LanguageSelector = string | LanguageFilter | (string | LanguageFilter)[];


	export interface CodeActionContext {
		diagnostics: Diagnostic[];
	}

	export interface CodeActionProvider {
		provideCodeActions(document: TextDocument, range: Range, context: CodeActionContext, token: CancellationToken): Command[] | Thenable<Command[]>;
	}

	/**
	 *
	 */
	export class CodeLens {
		range: Range;
		command: Command;
		constructor(range: Range);
	}

	/**
	 *
	 */
	export interface CodeLensProvider {

		/**
		 *
		 */
		provideCodeLenses(document: TextDocument, token: CancellationToken): CodeLens[] | Thenable<CodeLens[]>;

		/**
		 *
		 */
		resolveCodeLens?(codeLens: CodeLens, token: CancellationToken): any | Thenable<any>;
	}

	export type Definition = Location | Location[];

	export interface DefinitionProvider {
		provideDefinition(document: TextDocument, where: Position, token: CancellationToken): Definition | Thenable<Definition>;
	}

	export class Hover {

		contents: MarkedString[];

		range: Range;

		constructor(contents: MarkedString | MarkedString[], range?: Range);
	}

	export interface HoverProvider {
		provideHover(document: TextDocument, position: Position, token: CancellationToken): Hover | Thenable<Hover>;
	}

	export enum DocumentHighlightKind {
		Text,
		Read,
		Write
	}

	export class DocumentHighlight {
		constructor(range: Range, kind?: DocumentHighlightKind);
		range: Range;
		kind: DocumentHighlightKind;
	}

	export interface DocumentHighlightProvider {
		provideDocumentHighlights(document: TextDocument, position: Position, token: CancellationToken): DocumentHighlight[] | Thenable<DocumentHighlight[]>;
	}

	export enum SymbolKind {
		File,
		Module,
		Namespace,
		Package,
		Class,
		Method,
		Property,
		Field,
		Constructor,
		Enum,
		Interface,
		Function,
		Variable,
		Constant,
		String,
		Number,
		Boolean,
		Array,
	}

	export class SymbolInformation {
		constructor(name: string, kind: SymbolKind, range: Range, uri?: Uri, containerName?: string);
		name: string;
		containerName: string;
		kind: SymbolKind;
		location: Location;
	}

	export interface DocumentSymbolProvider {
		provideDocumentSymbols(document: TextDocument, token: CancellationToken): SymbolInformation[] | Thenable<SymbolInformation[]>;
	}

	export interface WorkspaceSymbolProvider {
		provideWorkspaceSymbols(query: string, token: CancellationToken): SymbolInformation[] | Thenable<SymbolInformation[]>;
	}

	export interface ReferenceProvider {
		provideReferences(document: TextDocument, position: Position, options: { includeDeclaration: boolean; }, token: CancellationToken): Location[] | Thenable<Location[]>;
	}

	export class TextEdit {
		static replace(range: Range, newText: string): TextEdit;
		static insert(position: Position, newText: string): TextEdit;
		static delete(range: Range): TextEdit;
		constructor(range: Range, newText: string);
		range: Range;
		newText: string;
	}

	/**
	 * A workspace edit reprents text changes to many documents.
	 */
	export class WorkspaceEdit {

		/**
		 * The number of affected resources.
		 *
		 * @readonly
		 */
		size: number;

		replace(resource: Uri, range: Range, newText: string): void;

		insert(resource: Uri, range: Position, newText: string): void;

		delete(resource: Uri, range: Range): void;

		entries(): [Uri, TextEdit[]][];
	}

	/**
	 *
	 */
	export interface RenameProvider {
		provideRenameEdits(document: TextDocument, position: Position, newName: string, token: CancellationToken): WorkspaceEdit | Thenable<WorkspaceEdit>;
	}

	export interface FormattingOptions {
		tabSize: number;
		insertSpaces: boolean;
		[key: string]: boolean | number | string;
	}

	/**
	 *
	 */
	export interface DocumentFormattingEditProvider {
		provideDocumentFormattingEdits(document: TextDocument, options: FormattingOptions, token: CancellationToken): TextEdit[] | Thenable<TextEdit[]>;
	}

	/**
	 *
	 */
	export interface DocumentRangeFormattingEditProvider {
		provideDocumentRangeFormattingEdits(document: TextDocument, range: Range, options: FormattingOptions, token: CancellationToken): TextEdit[] | Thenable<TextEdit[]>;
	}

	/**
	 *
	 */
	export interface OnTypeFormattingEditProvider {
		provideOnTypeFormattingEdits(document: TextDocument, position: Position, ch: string, options: FormattingOptions, token: CancellationToken): TextEdit[] | Thenable<TextEdit[]>;
	}

	export class ParameterInformation {
		label: string;
		documentation: string;
		constructor(label: string, documentation?: string);
	}

	export class SignatureInformation {
		label: string;
		documentation: string;
		parameters: ParameterInformation[];
		constructor(label: string, documentation?: string);
	}

	export class SignatureHelp {
		signatures: SignatureInformation[];
		activeSignature: number;
		activeParameter: number;
	}

	export interface SignatureHelpProvider {
		provideSignatureHelp(document: TextDocument, position: Position, token: CancellationToken): SignatureHelp | Thenable<SignatureHelp>;
	}

	export enum CompletionItemKind {
		Text,
		Method,
		Function,
		Constructor,
		Field,
		Variable,
		Class,
		Interface,
		Module,
		Property,
		Unit,
		Value,
		Enum,
		Keyword,
		Snippet,
		Color,
		File,
		Reference
	}

	export class CompletionItem {
		label: string;
		kind: CompletionItemKind;
		detail: string;
		documentation: string;
		sortText: string;
		filterText: string;
		insertText: string;
		textEdit: TextEdit;
		constructor(label: string);
	}

	export interface CompletionItemProvider {
		provideCompletionItems(document: TextDocument, position: Position, token: CancellationToken): CompletionItem[] | Thenable<CompletionItem[]>;
		resolveCompletionItem?(item: CompletionItem, token: CancellationToken): CompletionItem | Thenable<CompletionItem>;
	}

	export type CharacterPair = [string, string];

	export interface CommentRule {
		lineComment?: string;
		blockComment?: CharacterPair;
	}

	export interface IndentationRule {
		decreaseIndentPattern: RegExp;
		increaseIndentPattern: RegExp;
		indentNextLinePattern?: RegExp;
		unIndentedLinePattern?: RegExp;
	}

	export enum IndentAction {
		None,
		Indent,
		IndentOutdent,
		Outdent
	}

	export interface EnterAction {
		indentAction: IndentAction;
		appendText?: string;
		removeText?: number;
	}

	export interface OnEnterRule {
		beforeText: RegExp;
		afterText?: RegExp;
		action: EnterAction;
	}

	export interface LanguageConfiguration {
		comments?: CommentRule;
		brackets?: CharacterPair[];
		wordPattern?: RegExp;
		indentationRules?: IndentationRule;
		onEnterRules?: OnEnterRule[];
	}

	export interface WorkspaceConfiguration {

		/**
		 * @param section configuration name, supports _dotted_ names
		 * @return the value `section` denotes or the default
		 */
		get<T>(section: string, defaultValue?: T): T;

		/**
		 * @param section configuration name, supports _dotted_ names
		 * @return `true` iff the section doesn't resolve to `undefined`
		 */
		has(section: string): boolean;

		/**
		 * Readable dictionary that backs this configuration.
		 * @readonly
		 */
		[key: string]: any;
	}

	/**
	 *
	 */
	export interface Memento {
		/**
		 * @param key The name of a property to read.
		 * @param defaultValue The default value in case the denoted property doesn't exists.
		 * @return
		 */
		getValue<T>(key: string, defaultValue?: T): Thenable<T>;

		setValue(key: string, value: any): Thenable<void>;
	}

	/**
	 * Represents the severity of diagnostics.
	 */
	export enum DiagnosticSeverity {
		Hint = 3,
		Information = 2,
		Warning = 1,
		Error = 0
	}

	/**
	 * Represents a location inside a resource, such as a line
	 * inside a text file.
	 */
	export class Location {
		constructor(uri: Uri, range: Range | Position);
		uri: Uri;
		range: Range;
	}

	export interface DiagnosticCollection {

		/**
		 *
		 */
		name: string;

		/**
		 * Assign resource for given resource
		 */
		set(uri: Uri, diagnostics: Diagnostic[]): Thenable<void>;

		/**
		 * Remove all diagnostics from this collection that belong
		 * to the provided `uri`. The same as `#set(uri, undefined)`
		 */
		delete(uri: Uri): Thenable<void>;

		/**
		 * Replace all entries
		 */
		set(entries: [Uri, Diagnostic[]][]): Thenable<void>;

		/**
		 * Remove all diagnostics from this collection. The same
		 * as calling `#set(undefined)`;
		 */
		clear(): Thenable<void>;

		dispose(): void;
	}

	/**
	 * Represents a diagnostic, such as a compiler error or warning, along with the location
	 * in which they occurred.
	 */
	export class Diagnostic {

		range: Range;
		message: string;
		severity: DiagnosticSeverity;
		code: string | number;

		constructor(range: Range, message: string, severity?: DiagnosticSeverity);
	}

	export interface OutputChannel {

		/**
		 *
		 * @readonly
		 */
		name: string;

		append(value: string): Thenable<void>;

		appendLine(value: string): Thenable<void>;

		clear(): Thenable<void>;

		reveal(column?: ViewColumn): Thenable<void>;

		dispose(): void;
	}

	export enum StatusBarAlignment {
		Left,
		Right
	}

	export interface StatusBarItem {

		/**
		 * The alignment of this item, either left or right
		 * @readonly
		 */
		alignment: StatusBarAlignment;

		/**
		 * The priority of this item. It defined the sorting
		 * when multi items share the same [alignment](#alignment)
		 * @readonly
		 */
		priority: number;

		/**
		* The text to show for the entry. You can embed icons in the text by leveraging the syntax:
		*
		* `My text ${icon name} contains icons like ${icon name} this one.`
		*
		* Where the icon name is taken from the octicon icon set (https://octicons.github.com/), e.g.
		* light-bulb, thumbsup or zap.
		*/
		text: string;

		/**
		* An optional tooltip text to show when you hover over the entry
		*/
		tooltip: string;

		/**
		* An optional color to use for the entry
		*/
		color: string;

		/**
		* An optional id of a command that is known to the workbench to execute on click. This can either
		* be a built in workbench or editor command or a command contributed by an extension.
		*/
		command: string;

		/**
		 * Shows the entry in the status bar.
		 */
		show(): void;

		/**
		 * Removes the entry from the status bar.
		 */
		hide(): void;

		/**
		 * Disposes the status bar entry from the status bar
		 */
		dispose(): void;
	}

	export interface TextEditorSelectionChangeEvent {
		textEditor: TextEditor;
		selections: Selection[];
	}

	export interface TextEditorOptionsChangeEvent {
		textEditor: TextEditor;
		options: TextEditorOptions;
	}

	/**
	 * Namespace for commanding
	 */
	export namespace commands {

		/**
		 * Registers a command that can be invoked via a keyboard shortcut,
		 * an menu item, an action, or directly.
		 *
		 * @param command - The unique identifier of this command
		 * @param callback - The command callback
		 * @param thisArgs - (optional) The this context used when invoking {{callback}}
		 * @return Disposable which unregisters this command on disposal
		 */
		export function registerCommand(command: string, callback: CommandCallback, thisArg?: any): Disposable;

		/**
		 * Register a text editor command that will make edits.
		 * It can be invoked via a keyboard shortcut, a menu item, an action, or directly.
		 *
		 * @param command - The unique identifier of this command
		 * @param callback - The command callback. The {{textEditor}} and {{edit}} passed in are available only for the duration of the callback.
		 * @param thisArgs - (optional) The `this` context used when invoking {{callback}}
		 * @return Disposable which unregisters this command on disposal
		 */
		export function registerTextEditorCommand(command: string, callback: (textEditor: TextEditor, edit: TextEditorEdit) => void, thisArg?: any): Disposable;

		/**
		 * Executes a command
		 *
		 * @param command - Identifier of the command to execute
		 * @param ...rest - Parameter passed to the command function
		 * @return
		 */
		export function executeCommand<T>(command: string, ...rest: any[]): Thenable<T>;

		/**
		 * Retrieve the list of all avialable commands.
		 *
		 * @return Thenable that resolves to a list of command ids.
		 */
		export function getCommands(): Thenable<string[]>;
	}

	export namespace window {

		export let activeTextEditor: TextEditor;

		export const onDidChangeActiveTextEditor: Event<TextEditor>;

		export const onDidChangeTextEditorSelection: Event<TextEditorSelectionChangeEvent>;

		export const onDidChangeTextEditorOptions: Event<TextEditorOptionsChangeEvent>;

		/**
		 * Opens a document in an editor. Allows to define a selection and a view column in which
		 * the editor is opened.
		 */
		export function openTextEditor(document: TextDocument, selection?: Selection, column?: ViewColumn): Thenable<TextEditor>;

		/**
		 * Open a uri as document in an editor. Short-hand for:
		 * `workspace#openTextDocument(uri).then(doc => window#openTextEditor(doc))`
		 */
		export function openTextEditor(uri: Uri, selection?: Selection, column?: ViewColumn): Thenable<TextEditor>;

		/**
		 * Close a text editor.
		 */
		export function closeTextEditor(editor: TextEditor): Thenable<void>;

		export function showInformationMessage(message: string, ...items: string[]): Thenable<string>;

		export function showInformationMessage<T extends MessageItem>(message: string, ...items: T[]): Thenable<T>;

		export function showWarningMessage(message: string, ...items: string[]): Thenable<string>;

		export function showWarningMessage<T extends MessageItem>(message: string, ...items: T[]): Thenable<T>;

		export function showErrorMessage(message: string, ...items: string[]): Thenable<string>;

		export function showErrorMessage<T extends MessageItem>(message: string, ...items: T[]): Thenable<T>;

		/**
		 * Shows a selection list.
		 *
		 * @param items an array of strings to pick from.
		 * @param options configures the behavior of the selection list
		 * @return a promise that resolves to the selected string or undefined.
		 */
		export function showQuickPick(items: string[] | Thenable<string[]>, options?: QuickPickOptions): Thenable<string>;

		/**
		 * Shows a selection list.
		 *
		 * @param items an array of items to pick from.
		 * @param options configures the behavior of the selection list
		 * @return a promise that resolves to the selected item or undefined.
		 */
		export function showQuickPick<T extends QuickPickItem>(items: T[] | Thenable<T[]>, options?: QuickPickOptions): Thenable<T>;

		/**
		 * Opens an input box to ask the user for input.
		 *
		 * The returned value will be undefined if the input box was canceled (e.g. pressing ESC) and otherwise will
		 * have the user typed string or an empty string if the user did not type anything but dismissed the input
		 * box with OK.
		 */
		export function showInputBox(options?: InputBoxOptions): Thenable<string>;

		/**
		 * Returns a new output channel with the given name
		 */
		export function createOutputChannel(name: string): OutputChannel;

		/**
		* Add a status bar entry. Can be left or right aligned, expresses ordering
		* via priority.
		*
		* @param position either Left or Right
		* @param priority the higher the number, the more the entry moves to the left of the status bar
		*/
		export function createStatusBarItem(alignment?: StatusBarAlignment, priority?: number): StatusBarItem;
	}

	/**
	 * An event describing a change in the text of a model.
	 */
	export interface TextDocumentContentChangeEvent {
		/**
		 * The range that got replaced.
		 */
		range: Range;
		/**
		 * The length of the range that got replaced.
		 */
		rangeLength: number;
		/**
		 * The new text for the range.
		 */
		text: string;
	}

	export interface TextDocumentChangeEvent {
		document: TextDocument;
		contentChanges: TextDocumentContentChangeEvent[];
	}

	// TODO@api in the future there might be multiple opened folder in VSCode
	// so that we shouldn't make broken assumptions here
	export namespace workspace {

		/**
		 * Creates a file system watcher. A glob pattern that filters the
		 * file events must be provided. Optionally, flags to ignore certain
		 * kind of events can be provided.
		 *
		 * @param globPattern - A glob pattern that is applied to the names of created, changed, and deleted files.
		 * @param ignoreCreateEvents - Ignore when files have been created.
		 * @param ignoreChangeEvents - Ignore when files have been changed.
		 * @param ignoreDeleteEvents - Ignore when files have been deleted.
		 */
		export function createFileSystemWatcher(globPattern: string, ignoreCreateEvents?: boolean, ignoreChangeEvents?: boolean, ignoreDeleteEvents?: boolean): FileSystemWatcher;

		/**
		 * The folder that is open in VS Code if applicable
		 */
		export let rootPath: string;

		/**
		 * @return a path relative to the [root](#rootPath) of the workspace.
		 */
		export function asRelativePath(pathOrUri: string | Uri): string;

		// TODO@api - justify this being here
		export function findFiles(include: string, exclude: string, maxResults?: number): Thenable<Uri[]>;

		/**
		 * Save all dirty files
		 */
		export function saveAll(includeUntitled?: boolean): Thenable<boolean>;

		/**
		 * Apply the provided (workspace edit)[#WorkspaceEdit].
		 */
		export function applyEdit(edit: WorkspaceEdit): Thenable<boolean>;

		/**
		 * All text documents currently known to the system.
		 */
		export let textDocuments: TextDocument[];

		/**
		 * Creates a new text document from the provided text.
		 *
		 * @param text The contents of the document
		 * @param fileName An actual file name, nothing, or a random value. The resulting document will use the `untitled`-scheme
		 * @param language Language identifier, if omitted the language is derived from `uri`
		 * @return A promise that resolves to a [document](#TextDocument)
		 */
		export function createTextDocument(text: string, fileName?: string, language?: string): Thenable<TextDocument>;

		/**
		 * Opens the denoted document from disk. Will return early if the
		 * document is already open.
		 *
		 * @param uri
		 * @return A promise that resolves to a [document](#TextDocument)
		 */
		export function openTextDocument(uri: Uri): Thenable<TextDocument>;

		/**
		 * Like `openTextDocument(Uri.file(fileName))`
		 */
		export function openTextDocument(fileName: string): Thenable<TextDocument>;

		export const onDidOpenTextDocument: Event<TextDocument>;

		export const onDidCloseTextDocument: Event<TextDocument>;

		export const onDidChangeTextDocument: Event<TextDocumentChangeEvent>;

		export const onDidSaveTextDocument: Event<TextDocument>;

		/**
		 *
		 */
		export function getConfiguration(section?: string): WorkspaceConfiguration;

		// TODO: send out the new config?
		export const onDidChangeConfiguration: Event<void>;
	}

	export namespace languages {

		/**
		 * Return the identifiers of all known languages.
		 * @return Promise resolving to an array of identifier strings.
		 */
		export function getLanguages(): Thenable<string[]>;

		/**
		 * Compute the match between a language selector and a document. Value
		 * greater zero mean the selector matches with to the document.
		 */
		export function match(selector: LanguageSelector, document: TextDocument): number;

		/**
		 *
		 */
		export function createDiagnosticCollection(name?: string): DiagnosticCollection;

		/**
		 *
		 */
		export function registerCodeActionsProvider(language: LanguageSelector, provider: CodeActionProvider): Disposable;

		/**
		 *
		 */
		export function registerCodeLensProvider(language: LanguageSelector, provider: CodeLensProvider): Disposable;

		/**
		 *
		 */
		export function registerDefinitionProvider(selector: LanguageSelector, provider: DefinitionProvider): Disposable;

		/**
		 *
		 */
		export function registerHoverProvider(selector: LanguageSelector, provider: HoverProvider): Disposable;

		/**
		 *
		 */
		export function registerDocumentHighlightProvider(selector: LanguageSelector, provider: DocumentHighlightProvider): Disposable;

		/**
		 *
		 */
		export function registerDocumentSymbolProvider(selector: LanguageSelector, provider: DocumentSymbolProvider): Disposable;

		/**
		 *
		 */
		export function registerWorkspaceSymbolProvider(provider: WorkspaceSymbolProvider): Disposable;

		/**
		 *
		 */
		export function registerReferenceProvider(selector: LanguageSelector, provider: ReferenceProvider): Disposable;

		/**
		 *
		 */
		export function registerRenameProvider(selector: LanguageSelector, provider: RenameProvider): Disposable;

		/**
		 *
		 */
		export function registerDocumentFormattingEditProvider(selector: LanguageSelector, provider: DocumentFormattingEditProvider): Disposable;

		/**
		 *
		 */
		export function registerDocumentRangeFormattingEditProvider(selector: LanguageSelector, provider: DocumentRangeFormattingEditProvider): Disposable;

		/**
		 *
		 */
		export function registerOnTypeFormattingEditProvider(selector: LanguageSelector, provider: OnTypeFormattingEditProvider, firstTriggerCharacter: string, ...moreTriggerCharacter: string[]): Disposable;

		/**
		 *
		 */
		export function registerSignatureHelpProvider(selector: LanguageSelector, provider: SignatureHelpProvider, ...triggerCharacters: string[]): Disposable;

		/**
		 *
		 */
		export function registerCompletionItemProvider(selector: LanguageSelector, provider: CompletionItemProvider, ...triggerCharacters: string[]): Disposable;

		/**
		 *
		 */
		export function setLanguageConfiguration(language: string, configuration: LanguageConfiguration): Disposable;
	}

	export namespace extensions {

		export function getStateMemento(extensionId: string, global?: boolean): Memento;

		export function getExtension(extensionId: string): any;

		export function getExtension<T>(extensionId: string): T;
	}

	/**
	 * FormattedString can be used to render a tiny subset of markdown. FormattedString
	 * is either a string that supports **bold** and __italic__ or a code-block that
	 * provides a language and a code Snippet.
	 */
	export type MarkedString = string | { language: string; value: string };

	// --- Begin Monaco.Modes
	export namespace Modes {
		export interface ILanguage {
			// required
			name: string;								// unique name to identify the language
			tokenizer: Object;							// map from string to ILanguageRule[]

			// optional
			displayName?: string;						// nice display name
			ignoreCase?: boolean;							// is the language case insensitive?
			lineComment?: string;						// used to insert/delete line comments in the editor
			blockCommentStart?: string;					// used to insert/delete block comments in the editor
			blockCommentEnd?: string;
			defaultToken?: string;						// if no match in the tokenizer assign this token class (default 'source')
			brackets?: ILanguageBracket[];				// for example [['{','}','delimiter.curly']]

			// advanced
			start?: string;								// start symbol in the tokenizer (by default the first entry is used)
			tokenPostfix?: string;						// attach this to every token class (by default '.' + name)
			autoClosingPairs?: string[][];				// for example [['"','"']]
			wordDefinition?: RegExp;					// word definition regular expression
			outdentTriggers?: string;					// characters that could potentially cause outdentation
			enhancedBrackets?: Modes.IRegexBracketPair[];// Advanced auto completion, auto indenting, and bracket matching
		}

		/**
		 * This interface can be shortened as an array, ie. ['{','}','delimiter.curly']
		 */
		export interface ILanguageBracket {
			open: string;	// open bracket
			close: string;	// closeing bracket
			token: string;	// token class
		}

		export interface ILanguageAutoComplete {
			triggers: string;				// characters that trigger auto completion rules
			match: string | RegExp;			// autocomplete if this matches
			complete: string;				// complete with this string
		}

		export interface ILanguageAutoIndent {
			match: string | RegExp; 			// auto indent if this matches on enter
			matchAfter: string | RegExp;		// and auto-outdent if this matches on the next line
		}

		/**
		 * Standard brackets used for auto indentation
		 */
		export interface IBracketPair {
			tokenType: string;
			open: string;
			close: string;
			isElectric: boolean;
		}

		/**
		 * Regular expression based brackets. These are always electric.
		 */
		export interface IRegexBracketPair {
			openTrigger?: string; // The character that will trigger the evaluation of 'open'.
			open: RegExp; // The definition of when an opening brace is detected. This regex is matched against the entire line upto, and including the last typed character (the trigger character).
			closeComplete?: string; // How to complete a matching open brace. Matches from 'open' will be expanded, e.g. '</$1>'
			matchCase?: boolean; // If set to true, the case of the string captured in 'open' will be detected an applied also to 'closeComplete'.
			// This is useful for cases like BEGIN/END or begin/end where the opening and closing phrases are unrelated.
			// For identical phrases, use the $1 replacement syntax above directly in closeComplete, as it will
			// include the proper casing from the captured string in 'open'.
			// Upper/Lower/Camel cases are detected. Camel case dection uses only the first two characters and assumes
			// that 'closeComplete' contains wors separated by spaces (e.g. 'End Loop')

			closeTrigger?: string; // The character that will trigger the evaluation of 'close'.
			close?: RegExp; // The definition of when a closing brace is detected. This regex is matched against the entire line upto, and including the last typed character (the trigger character).
			tokenType?: string; // The type of the token. Matches from 'open' or 'close' will be expanded, e.g. 'keyword.$1'.
			// Only used to auto-(un)indent a closing bracket.
		}

		/**
		 * Definition of documentation comments (e.g. Javadoc/JSdoc)
		 */
		export interface IDocComment {
			scope: string; // What tokens should be used to detect a doc comment (e.g. 'comment.documentation').
			open: string; // The string that starts a doc comment (e.g. '/**')
			lineStart: string; // The string that appears at the start of each line, except the first and last (e.g. ' * ').
			close?: string; // The string that appears on the last line and closes the doc comment (e.g. ' */').
		}

		// --- Begin TokenizationSupport
		enum Bracket {
			None = 0,
			Open = 1,
			Close = -1
		}

		export var hasTextMateTokenizerSupport: boolean;

		// --- Begin IElectricCharacterSupport
		export interface IElectricCharacterSupport {
			brackets: IBracketPair[];
			regexBrackets?: IRegexBracketPair[];
			docComment?: IDocComment;
			caseInsensitive?: boolean;
			embeddedElectricCharacters?: string[];
		}
		export var ElectricCharacterSupport: {
			register(modeId: string, electricCharacterSupport: IElectricCharacterSupport): Disposable;
		};
		// --- End IElectricCharacterSupport

		// --- Begin ICharacterPairSupport
		export interface ICharacterPairSupport {
			autoClosingPairs: IAutoClosingPairConditional[];
			surroundingPairs?: IAutoClosingPair[];
		}

		/**
		 * Interface used to support insertion of matching characters like brackets and qoutes.
		 */
		export interface IAutoClosingPair {
			open: string;
			close: string;
		}
		export interface IAutoClosingPairConditional extends IAutoClosingPair {
			notIn?: string[];
		}
		export var CharacterPairSupport: {
			register(modeId: string, characterPairSupport: ICharacterPairSupport): Disposable;
		};
		// --- End ICharacterPairSupport

		export interface IWorker<T> {
			disposable: Disposable;
			load(): Thenable<T>;
		}

		function registerMonarchDefinition(modeId: string, language: Modes.ILanguage): Disposable;
		function loadInBackgroundWorker<T>(scriptSrc: string): IWorker<T>;

	}


}

/**
 * Thenable is a common denominator between ES6 promises, Q, jquery.Deferred, WinJS.Promise,
 * and others. This API makes no assumption about what promise libary is being used which
 * enables reusing existing code without migrating to a specific promise implementation. Still,
 * we recommand the use of native promises which are available in VS Code.
 */
interface Thenable<R> {
    /**
    * Attaches callbacks for the resolution and/or rejection of the Promise.
    * @param onfulfilled The callback to execute when the Promise is resolved.
    * @param onrejected The callback to execute when the Promise is rejected.
    * @returns A Promise for the completion of which ever callback is executed.
    */
    then<TResult>(onfulfilled?: (value: R) => TResult | Thenable<TResult>, onrejected?: (reason: any) => TResult | Thenable<TResult>): Thenable<TResult>;
    then<TResult>(onfulfilled?: (value: R) => TResult | Thenable<TResult>, onrejected?: (reason: any) => void): Thenable<TResult>;
}

// ---- ES6 promise ------------------------------------------------------

/**
 * Represents the completion of an asynchronous operation
 */
interface Promise<T> extends Thenable<T> {
    /**
    * Attaches callbacks for the resolution and/or rejection of the Promise.
    * @param onfulfilled The callback to execute when the Promise is resolved.
    * @param onrejected The callback to execute when the Promise is rejected.
    * @returns A Promise for the completion of which ever callback is executed.
    */
    then<TResult>(onfulfilled?: (value: T) => TResult | Thenable<TResult>, onrejected?: (reason: any) => TResult | Thenable<TResult>): Promise<TResult>;
    then<TResult>(onfulfilled?: (value: T) => TResult | Thenable<TResult>, onrejected?: (reason: any) => void): Promise<TResult>;

    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch(onrejected?: (reason: any) => T | Thenable<T>): Promise<T>;

    // [Symbol.toStringTag]: string;
}

interface PromiseConstructor {
    // /**
    //   * A reference to the prototype.
    //   */
    // prototype: Promise<any>;

    /**
     * Creates a new Promise.
     * @param executor A callback used to initialize the promise. This callback is passed two arguments:
     * a resolve callback used resolve the promise with a value or the result of another promise,
     * and a reject callback used to reject the promise with a provided reason or error.
     */
    new <T>(executor: (resolve: (value?: T | Thenable<T>) => void, reject: (reason?: any) => void) => void): Promise<T>;

    /**
     * Creates a Promise that is resolved with an array of results when all of the provided Promises
     * resolve, or rejected when any Promise is rejected.
     * @param values An array of Promises.
     * @returns A new Promise.
     */
    all<T>(values: Array<T | Thenable<T>>): Promise<T[]>;

    /**
     * Creates a Promise that is resolved or rejected when any of the provided Promises are resolved
     * or rejected.
     * @param values An array of Promises.
     * @returns A new Promise.
     */
    race<T>(values: Array<T | Thenable<T>>): Promise<T>;

    /**
     * Creates a new rejected promise for the provided reason.
     * @param reason The reason the promise was rejected.
     * @returns A new rejected Promise.
     */
    reject(reason: any): Promise<void>;

    /**
     * Creates a new rejected promise for the provided reason.
     * @param reason The reason the promise was rejected.
     * @returns A new rejected Promise.
     */
    reject<T>(reason: any): Promise<T>;

    /**
      * Creates a new resolved promise for the provided value.
      * @param value A promise.
      * @returns A promise whose internal state matches the provided promise.
      */
    resolve<T>(value: T | Thenable<T>): Promise<T>;

    /**
     * Creates a new resolved promise .
     * @returns A resolved promise.
     */
    resolve(): Promise<void>;

    // [Symbol.species]: Function;
}

declare var Promise: PromiseConstructor;

// TS 1.6 & node_module
export = vscode;

// declare module 'vscode' {
//     export = vscode;
// }
