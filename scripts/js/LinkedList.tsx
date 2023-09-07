namespace DataStructure
{
	class Node<T=string>
	{
		public data : T;
		public prev : Node<T>;
		public next : Node<T>;

		public constructor(data: T, prev: Node<T> = null, next: Node<T> = null)
		{
			this.data = data;
			this.prev = prev;
			this.next = next;
		}
	}

	export class LinkedList<T=string>
	{
		protected head: Node<T>;
		protected tail: Node<T>;
		protected _size: number;

		public constructor()
		{
			this.head = null;
			this.tail = null;
			this._size = 0;
		}

		public append(data: T)
		{
			this._size++;
			const node = new Node<T>(data, this.tail, null);

			if (this.tail) this.tail.next = node;
			if (!this.head) this.head = node;

			this.tail = node;
		}

		public prepend(data: T)
		{
			this._size++;
			const node = new Node(data, null, this.head);

			this.head = node;
			if (!this.tail) this.tail = node;
		}

		public find(data: T, equalFunc: (a: T, b: T) => boolean = null) : Node<T> | null
		{
			if (!this.head) return null;

			let current: Node<T> = this.head;

			while (current)
			{
				if (equalFunc) { if (equalFunc(current.data, data)) return current; }
				else { if (current.data === data) return current; }

				current = current.next;
			}
			return null
		}

		public insertAfter(after: T, data: T) : boolean
		{
			this._size++;
			const found = this.find(after);
			if (!found) return false;

			found.next = new Node(data, found.next);
			return true;
		}

		public remove(data: T) : boolean
		{
			this._size--;
			if (!this.head) return null;

			if (this.head && this.head.data === data)
			{
				this.head = this.head.next;
				this.head.prev = null;
			}

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
			const nodes = [];
			let current: Node<T> = this.head;

			while (current)
			{
				nodes.push(current);
				current = current.next;
			}
			return nodes
		}

		public forEach(callback: (data: T) => T)
		{
			if (!callback || !this.head) return;
			let current: Node<T> = this.head;

			while (current)
			{
				current.data = callback(current.data);
				current = current.next;
			}
		}

		public size() : number { return this._size; }
	}

	const list = new LinkedList();

	list.append('a');
	list.append('b');
	list.append('c');
	list.append('d');
	list.append('f');

	console.log(list.toArray());
	list.forEach(data => data + '***');
	console.log(list.toArray());
}
