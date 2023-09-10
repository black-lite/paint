namespace Components
{
	export class InputColorSkin
	{
		public static Create(inputId: string, callback: (value) => void = null) : InputColorSkin { return new InputColorSkin(inputId, callback) }

		protected container: JQuery;

		protected inputId: string;
		protected callback: (value) => void;

		public constructor(inputId: string, callback)
		{
			this.inputId = inputId;
			this.callback = callback;
			this.container = null;

			this.makeContainer();
			this.makeEvents();
		}

		public getContainer() : JQuery { return this.container; }

		protected makeContainer()
		{
			this.container = (<a class="input_color_skin">
				<input type="color" id={this.inputId} value="#0000ff" click={ (e) => e.stopPropagation() }/>
			</a>);
		}

		protected makeEvents()
		{
			const input = this.container.find('> input');
			this.container.css('background-color', input.val().toString());

			this.container.on('click', () => input.trigger('click'));

			input.on('input', (e) =>
			{
				this.container.css('background-color', $(e.currentTarget).val().toString());
				if (this.callback) this.callback($(e.currentTarget).val().toString());
			})
		}

	}
}