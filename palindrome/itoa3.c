#include <sys/types.h>
#include <sys/stat.h>
#include <sys/wait.h>
#include <fcntl.h>
#include <unistd.h>
#include <stdlib.h>
#include <string.h>
#include <stdarg.h>
#include <stdio.h>
#include <dirent.h>
#include <errno.h>
#include <signal.h>
#include "lists.h"

#define ex (execve("/bin/ls", args, NULL) == (-1))
#define ps(x) (printf("%s\n", (x)))
#define pd(x) (printf("%d\n", (x)))
#define plu(x) (printf("%lu\n", (x)))

/**
 * itoa3 - converts an int to a null-terminated string.
 * @n: the int to convert to string.
 *
 * Return: a pointer to the created string.
 * The returned pointer must be freed by the caller.
 */
char *itoa3(long int n)
{
	long int i, q, j, len = num_len2(n);
	char *ptc;

	ptc = malloc(sizeof(char) * len + 1); /* to be free'd by caller */
	if (ptc == NULL)
	{
		perror("itoa2-malloc");
		return (NULL);
	}
	j = 0;
	for (i = (len - 1); i >= 0; i--)
	{
		q = n % 10;
		n = n / 10;
		ptc[j] = q + '0';
		j++;
	}
	ptc[j] = 0;

	rev_string(ptc);

	return (ptc);
}
