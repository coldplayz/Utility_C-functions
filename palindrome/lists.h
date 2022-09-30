#ifndef lists_h
#define lists_h
#include <stddef.h>



/**
 * struct list_s - singly linked list
 * @str: string - (malloc'ed string)
 * @len: length of the string
 * @next: points to the next node
 *
 * Description: singly linked list node structure
 */
typedef struct list_s
{
	char *str;
	unsigned int len;
	struct list_s *next;
} list_t;


/**
 * struct listint_s - singly linked list
 * @n: integer
 * @next: points to the next node
 *
 * Description: singly linked list node structure
 */
typedef struct listint_s
{
	int n;
	struct listint_s *next;
} listint_t;


/**
 * struct dlistint_s - doubly linked list
 * @n: integer
 * @prev: points to the previous node
 * @next: points to the next node
 *
 * Description: doubly linked list node structure
 */
typedef struct dlistint_s
{
	int n;
	struct dlistint_s *prev;
	struct dlistint_s *next;
} dlistint_t;


/**
 * struct in - collection of integers
 * @n: an int
 * @i: an int
 * @flag: an int
 *
 * Description: used to work around variable number declaration limit
 */
typedef struct in
{
	int n;
	int i;
	int flag;
} in;

/**
 * struct st - collection of pointers to listint_t objects
 * @temp1: a pointer to listint_t type
 * @temp2: a pointer to listint_t type
 *
 * Description: used to try to work around variable limit
 */
typedef struct st
{
	listint_t *temp1;
	listint_t *temp2;
} st;

size_t print_list(const list_t *h);
size_t list_len(const list_t *h);
list_t *add_node(list_t **head, const char *str);
int _strlen(const char *s);
list_t *add_node_end(list_t **head, const char *str);

size_t print_listint(const listint_t *h);
size_t listint_len(const listint_t *h);
listint_t *add_nodeint(listint_t **head, const int n);
listint_t *add_nodeint_end(listint_t **head, const int n);
void free_listint(listint_t *head);
void free_listint2(listint_t **head);
int pop_listint(listint_t **head);
listint_t *get_nodeint_at_index(listint_t *head, unsigned int index);
int sum_listint(listint_t *head);
listint_t *insert_nodeint_at_index(listint_t **head, unsigned int idx, int n);
int delete_nodeint_at_index(listint_t **head, unsigned int index);
void pop_listint2(listint_t **head);
listint_t *reverse_listint(listint_t **head);
size_t printListInt2(const listint_t *h);
size_t print_listint_safe(const listint_t *head);
listint_t *list_loop_node(const listint_t *head);
size_t printListInt3(const listint_t *h, const listint_t *loop_node);
size_t free_listint_safe(listint_t **h);
size_t freeListInt2(listint_t **h);
size_t freeListInt3(listint_t **h, listint_t *loop_node);
listint_t *find_listint_loop(listint_t *head);
listint_t *list_loop_node2(const listint_t *head);
int check_cycle(listint_t *list);
listint_t *insert_node(listint_t **head, int number);
int is_palindrome(listint_t **head);


/* string operations */
int str_palindrome(char *str);
void rev_string(char *s);
int str2posint(char *str);
int _atoi2(char c);



/* integeral operations */
char *itoa3(long int n);
long int num_len2(long int n);
int pwr(int base, int index);




/* Doubly linked list */
size_t print_dlistint(const dlistint_t *h);
size_t dlistint_len(const dlistint_t *h);
dlistint_t *add_dnodeint(dlistint_t **head, const int n);
dlistint_t *add_dnodeint_end(dlistint_t **head, const int n);
void free_dlistint(dlistint_t *head);
dlistint_t *get_dnodeint_at_index(dlistint_t *head, unsigned int index);
int sum_dlistint(dlistint_t *head);
dlistint_t *insert_dnodeint_at_index(dlistint_t **h, unsigned int idx, int n);
int delete_dnodeint_at_index(dlistint_t **head, unsigned int index);



#endif /*lists_h*/
