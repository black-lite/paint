namespace DataStructure
{
	class Node<T=string>
	{
		public data : T;
		public next : Node<T>;

		public constructor(data: T, next: Node<T> = null)
		{
			this.data = data;
			this.next = next;
		}
	}

	class LinkedList<T=string>
	{
		protected head: Node<T>;
		protected tail: Node<T>;

		public constructor()
		{
			this.head = null;
			this.tail = null;
		}

		public append(data)
		{
			const node = new Node<T>(data);

			if (this.tail) this.tail.next = node;
			if (!this.head) this.head = node;

			this.tail = node;
		}

		public prepend(data)
		{
			const node = new Node(data, this.head);

			this.head = node;
			if (!this.tail) this.tail = node;
		}

		public find(data) : Node<T>
		{
			if (!this.head) return null;

			let current: Node<T> = this.head;

			while (current)
			{
				if (current.data === data) return current;
				current = current.next;
			}
			return null
		}

		public insertAfter(after, data) : boolean
		{
			const found = this.find(after);
			if (!found) return false;

			found.next = new Node(data, found.next);
			return true;
		}

		public remove(data) : boolean
		{
			if (!this.head) return null;

			if (this.head && this.head.data === data) this.head = this.head.next;

			let current: Node<T> = this.head;
			while (current.next)
			{
				if (current.next.data === data) current.next = current.next.next;
				else current = current.next;
			}
			if (this.tail.data === data) this.tail = current;
		}

		public toArray() : Node<T>[]
		{
			const output = [];
			let current: Node<T> = this.head;

			while (current)
			{
				output.push(current);
				current = current.next;
			}
			return output
		}
	}

	const list = new LinkedList();
}